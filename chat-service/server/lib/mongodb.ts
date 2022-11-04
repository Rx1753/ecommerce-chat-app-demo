const mongoose = require('mongoose');

class DbConnection {
  static async connect(dsn: string) {
    mongoose.connect(dsn);
  }
}

export = DbConnection;
