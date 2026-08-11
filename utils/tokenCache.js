let token = null;
let expirTime = null;

function get() {
  return token;
}
function set(newToken) {
  token = newToken;
}

function expireTime() {
  return expirTime;
}
function setExpire(time) {
  expirTime = Number(time);
}

module.exports = {
  get,
  set,
  expireTime,
  setExpire,
};
