(function() {
    'use strict';
    angular.module('threebund').service('dhis', ['$http', 'AUTH', '$q', 'x2js',
        function($http, authHeader, $q, x2js) {
            var fileSetting = 'spectrumConfigFiles';
            var stateSetting = 'spectrumImportState';

            // We're currently hosting the XML configuration file directly on GitHub from this app in the associated resources repository.
            // However, Github When you request certain types of files (like JavaScript, CSS, or HTML) from raw.githubusercontent.com or
            // gist.githubusercontent.com, GitHub serves them with a Content-Type header set to text/plain. As a result, most modern browsers
            // won't actually interpret these files as JavaScript, CSS, or HTML and will instead just display them as text.
            // GitHub does this because serving raw files from a git repo is inefficient and they want to discourage people from
            // using their GitHub repos for static file hosting.
            // The service RawGit.com acts as a caching proxy. It forwards requests to GitHub, caches the responses, and relays them to the
            // browser with an appropriate Content-Type header based on the extension of the file that was requested. The caching layer
            // ensures that minimal load is placed on GitHub, and you get quick and easy static file hosting right from a GitHub repo.
            // Long term for the UNAIDS app, this may not be the best approach as we don't know how long RawGit will continue to offer this
            // service.  So, it may eventually be better to create e.g. a persistent url within *.unaids.org to host these critical files.
            // -- Jul 21, 2016  whotopia
            // current raw file links are:
            // dataElementFile: https://raw.githubusercontent.com/UNAIDS/dhis2-unaids-eppspectrum-resources/master/configuration/current/hivpopdata_DataElements.xml
            // indicatorFile:   https://raw.githubusercontent.com/UNAIDS/dhis2-unaids-eppspectrum-resources/master/configuration/current/hivpopdata_Indicators.xml
            // dashboardFile:   https://raw.githubusercontent.com/UNAIDS/dhis2-unaids-eppspectrum-resources/master/configuration/current/hivpopdata_Documents.xml
            var initialConfig = {
                dataElementFile: 'https://cdn.rawgit.com/UNAIDS/dhis2-unaids-eppspectrum-resources/master/configuration/current/hivpopdata_DataElements.xml',
                indicatorFile:   'https://cdn.rawgit.com/UNAIDS/dhis2-unaids-eppspectrum-resources/master/configuration/current/hivpopdata_Indicators.xml',
                dashboardFile:   'https://cdn.rawgit.com/UNAIDS/dhis2-unaids-eppspectrum-resources/master/configuration/current/hivpopdata_Documents.xml',
                strategy: {
                    value: 'NEW',
                    text: 'New Only'
                }
            };

            var initialState = {
                indicator: false,
                dataElement: false,
                dashboard: false,
            };
            var buildUrl = function(path) {
                var def = $q.defer();
                if (path.indexOf('http') > -1) {
                    def.resolve(path);
                }
                $http.get('manifest.webapp').then(function(response) {
                    var endpoint = response.data.activities.dhis.href;
                    if (endpoint === "*") {
                        endpoint = '';
                    }
                    var url = endpoint + path;
                    def.resolve(url);
                });
                return def.promise;
            };

            var getSetting = function(key) {
                return buildUrl('/api/systemSettings/' + key).then(function(url) {
                    return $http.get(url);
                });
            };

            var putSetting = function(key, value) {
                return buildUrl('/api/systemSettings/' + key).then(function(url) {
                    return $http({
                        method: 'POST',
                        url: url,
                        data: value,
                        headers: {
                            "Content-Type": 'text/plain'
                        }
                    });
                });

            };
            var resetSettings = function() {
                return putSetting(fileSetting, initialConfig);
            };
            var getState = function() {
                var settingDeferred = $q.defer();
                var promise = getSetting(stateSetting);
                promise.then(function(response) {
                    if (response.data !== "") {
                        settingDeferred.resolve(response.data);
                    } else {
                        putSetting(stateSetting, initialState);
                        settingDeferred.resolve(initialState);
                    }
                }, function(data, status) {
                    settingDeferred.reject(data, status);
                });
                return settingDeferred.promise;
            };

            var putState = function(value) {
                return putSetting(stateSetting, value);
            };

            var updateState = function(key, value) {
                return getState().then(function(state) {
                    state[key] = value;
                    return putState(state);
                });
            };
            var getConfig = function() {
                var configDeferred = $q.defer();
                var promise = getSetting(fileSetting);
                promise.then(function(response) {
                    if (response.data !== "") {
                        configDeferred.resolve(response.data);
                    } else {
                        putSetting(fileSetting, initialConfig);
                        configDeferred.resolve(initialConfig);
                    }
                }, function(data, status) {
                    configDeferred.reject(data, status);
                });
                return configDeferred.promise;
            };

            var updateConfig = function(value) {
                return putSetting(fileSetting, value);
            };

            var getApplicationTitle = function() {
                var titleDeferred = $q.defer();
                var promise = getSetting('applicationTitle');
                var parseTitle = function(response) {
                    var title = response.data;
                    titleDeferred.resolve(title);
                };
                promise.then(parseTitle, function(data, status) {
                    titleDeferred.reject(data, status);
                });
                return titleDeferred.promise;
            };

            var loadResource = function(path) {
                var resourceDeferred = $q.defer();
                var parseResource = function(response) {
                    resourceDeferred.resolve(response.data);
                };
                buildUrl(path).then(function(url) {
                    $http.get(url).then(parseResource, function(data, status) {
                        resourceDeferred.reject(data, status);
                    });
                });
                return resourceDeferred.promise;
            };

            var uploadResource = function(path, strategy) {
                strategy = strategy || {
                    value: 'NEW',
                    text: 'New Only'
                };
                var resourceDeferred = $q.defer();
                var parseImportResponse = function(response) {
                    var data = x2js.xml_str2json(response.data);
                    resourceDeferred.resolve(data);
                };
                loadResource(path).then(function(resource) {
                    buildUrl('/api/metaData?importStrategy=' + strategy.value).then(function(url) {
                        $http({
                            method: 'POST',
                            url: url,
                            data: resource,
                            headers: {
                                "Content-Type": 'application/xml'
                            }
                        }).then(parseImportResponse, function(data, status) {
                            resourceDeferred.reject(data, status);
                        });
                    });
                }, function(data, status) {
                    resourceDeferred.reject(data, status);
                });
                return resourceDeferred.promise;
            };

            var documentsLike = function(name) {
                var documentsDeferred = $q.defer();

                buildUrl('/api/documents.json?filter=name:like:' + name + '&fields=name,url').then(function(url) {
                    $http.get(url).then(function(response) {
                        documentsDeferred.resolve(response.data);
                    }, function(data, status) {
                        documentsDeferred.reject(data, status);
                    });
                });

                return documentsDeferred.promise;
            };

            return {
                "uploadResource": uploadResource,
                "getApplicationTitle": getApplicationTitle,
                "getSetting": getSetting,
                "putSetting": putSetting,
                "getConfig": getConfig,
                "updateConfig": updateConfig,
                "getState": getState,
                "putState": putState,
                "updateState": updateState,
                "resetSettings": resetSettings,
                "dhisUrl": buildUrl,
                "documentsLike": documentsLike
            };
        }
    ]);
})();
