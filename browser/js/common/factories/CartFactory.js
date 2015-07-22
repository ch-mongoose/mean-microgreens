app.factory('CartFactory', function ($rootScope){
  return {

    deleteItem: function (key) {
      localStorage.removeItem(key);
    },

    getCart: function(){
      var archive = [],
          keys = Object.keys(localStorage);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] === "debug" || keys[i] === ""){
          continue;
        } else {
          var toObj = JSON.parse(localStorage.getItem(keys[i]));
          archive.push(toObj);
        }
      }
      return archive;
    },

    saveCart: function (name, info) {
      localStorage.setItem(name, JSON.stringify(info));
    },

    clearAllinCart: function () {
      localStorage.clear();
    }
  };
});
