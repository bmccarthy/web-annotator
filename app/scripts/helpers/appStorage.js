var getAppStorage = function ($q) {
  return {
    get: function (key) {
      var deferred = $q.defer();

      chrome.storage.sync.get(key, function (data) {
        deferred.resolve(data[key]);
      });

      return deferred.promise;
    },
    set: function (key, value) {
      var deferred = $q.defer();

      var data = {};
      data[key] = value;
      chrome.storage.sync.set(data, function () {
        deferred.resolve({});
      });

      return deferred.promise;
    },
    del: function (key) {
      var deferred = $q.defer();

      chrome.storage.sync.remove(key, function () {
        deferred.resolve({});
      });

      return deferred.promise;
    }
  };
};
