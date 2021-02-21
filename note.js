var fs = require("fs");

module.exports = class Note {
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
            this.note = [];
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
        res(this.note);
      });
    });
  }
  write() {
    return new Promise((res, rej) => {
      fs.writeFile(this.file, JSON.stringify(this.note), (err) => {
        if (err) {
          rej(err);
        }
        res(this.note);
      });
    });
  }

  add(note) {
    return this.init().then(() => {
      return this.read().then(() => {
        console.log("Adding note: ", note);
        this.note.push(note);
        return this.write();
      });
    });
  }

  update(index, newNote) {
    return this.init().then(() => {
      return this.read().then(() => {
        console.log(`updating note at index ${index} with ${newNote}`);
        this.note[index] = newNote;
        return this.write();
      });
    });
  }
  remove(userName, index) {
    return this.init().then(() => {
      return this.read().then(() => {
        // console.log("Note to delete: ", this.note[index]);

        let notes = [];
        for (let i = 0; i < this.note.length; i++) {
          if (Object.keys(this.note[i]).includes(userName)) {
            notes.push(this.note[i].userName);
          }
        }
        console.log(notes);
        let targetIndex = this.note.indexOf(notes[index]);

        this.note.splice(targetIndex, 1);
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
