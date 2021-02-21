var fs = require("fs");

module.exports = class User {
  constructor(file) {
    this.file = file;
    this.initPromise = null;
    this.init();
  }
  init() {
    if (this.initPromise === null) {
      this.initPromise = new Promise((res, rej) => {
        this.read()
          .then(() => {
            res();
          })
          .catch(() => {
            this.user = [];
            this.write().then(res).catch(rej);
          });
      });
    }
    return this.initPromise;
  }
  read() {
    return new Promise((res, rej) => {
      fs.readFile(this.file, "utf-8", (err, data) => {
        if (err) {
          rej(err);
        }
        try {
          this.note = JSON.parse(data);
        } catch (err) {
          rej(err);
        }
        res(this.user);
      });
    });
  }
  write() {
    return new Promise((res, rej) => {
      fs.writeFile(this.file, JSON.stringify(this.user), (err) => {
        if (err) {
          rej(err);
        }
        res(this.note);
      });
    });
  }

  add(user) {
    return this.init().then(() => {
      return this.read().then(() => {
        console.log("Adding user: ", user);
        this.note.push(user);
        return this.write();
      });
    });
  }

  update(index, newUser) {
    return this.init().then(() => {
      return this.read().then(() => {
        console.log(`updating note at index ${index} with ${newUser}`);
        this.user[index] = newUser;
        return this.write();
      });
    });
  }
  remove(index) {
    return this.init().then(() => {
      return this.read().then(() => {
        console.log("User to delete: ", this.user[index]);
        this.user.splice(index, 1);
        return this.write();
      });
    });
  }
  list() {
    return this.init().then(() => {
      return this.read();
    });
  }
};
