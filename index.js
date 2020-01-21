/**
 * Wood Plugin Module.
 * user role
 * by jlego on 2018-11-28
 */
module.exports = (app = {}, config = {}) => {
  app.CheckRole = async function(req, res, next) {
    if(req.User){
      let RedisCaches = new app.Plugin('redis').Redis(`userrole.${req.User.role}`, config.redis, app),
        urlArr = req.url.split('/'),
        actionType = urlArr.pop(),
        key = urlArr.join('_'),
        hasVal = await RedisCaches.isHaseExist(key);
      if(hasVal){
        let actionArr = await RedisCaches.getHaseValue(key),
          actionMap = {
            list:   "read", 
            detail: "read", 
            create: "create", 
            add:    "create", 
            update: "update", 
            remove: "remove",
            delete: "remove",
          },
          action = actionMap[actionType];
        if(actionArr.includes(action)){
          next();
        }else{
          if(res.print) res.print(app.error(`用户没有[${action}]权限`));
          return false;
        }
      }
    }
    if(res.print) res.print(app.error('找不到当前用户信息'));
    return false;
  };
  if(app.addAppProp) app.addAppProp('Userrole', app.CheckRole);
  return app;
}
