const fs = require("fs").promises;

/**
 * AUTOR        : ISMAIL SAMUDRA
 * CONTACT      : 083136245050
 * TIME RELEASE : 11-06-2024.
 */
class JsonCrudDB {
  constructor(filePath, schema = {}) {
    this.filePath = filePath;
    this.indexes = {};
    this.data = null;
    this.schema = schema;
    this.isLoaded = false;
  }
  async load() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      this.data = JSON.parse(data);
      this.isLoaded = true;
    } catch (error) {
      if (error.code === "ENOENT") {
        this.data = {};
        this.isLoaded = true;
        await this.save();
      } else {
        throw new Error(
          `Failed to load data from ${this.filePath}: ${error.message}`
        );
      }
    }
  }
  async save() {
    try {
      const jsonData = JSON.stringify(this.data, null, 2);
      await fs.writeFile(this.filePath, jsonData, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to save data to ${this.filePath}: ${error.message}`
      );
    }
  }
  async ensureLoaded() {
    if (!this.isLoaded) {
      await this.load();
    }
  }
  async createIndex(indexName) {
    await this.ensureLoaded();

    if (!this.indexes[indexName]) {
      this.indexes[indexName] = {};

      for (const key in this.data) {
        const value = this.data[key][indexName];

        if (value !== undefined) {
          this.indexes[indexName][value] = this.indexes[indexName][value] || [];
          this.indexes[indexName][value].push(key);
        }
      }
    }
  }
  async getAutoIncrementId() {
    await this.ensureLoaded();

    let maxId = 0;
    for (const key in this.data) {
      const id = parseInt(key);
      if (!isNaN(id) && id > maxId) {
        maxId = id;
      }
    }

    return maxId + 1;
  }
  async findOne(query) {
    try {
      await this.ensureLoaded();
      if (this.schema) {
        for (const key of Object.keys(query)) {
          const field = this.schema[key];
          if (!field) {
            continue;
          }
          if (typeof query[key] !== field.type) {
            throw new Error(
              `FindOne validation failed: Field '${key}' must be of type '${field.type}'.`
            );
          }
          if (
            field.validate &&
            typeof field.validate === "function" &&
            !field.validate(query[key])
          ) {
            throw new Error(
              `FindOne validation failed: Field '${key}' failed custom validation.`
            );
          }
        }
      }

      const keys = Object.keys(this.data);

      for (const key of keys) {
        let match = true;

        for (const queryKey in query) {
          if (this.indexes[queryKey]) {
            const values = Array.isArray(query[queryKey])
              ? query[queryKey]
              : [query[queryKey]];

            if (!values.includes(this.data[key][queryKey])) {
              match = false;
              break;
            }
          } else {
            if (this.data[key][queryKey] !== query[queryKey]) {
              match = false;
              break;
            }
          }
        }

        if (match) {
          return this.data[key];
        }
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to execute findOne operation: ${error.message}`);
    }
  }
  async find(query, returnKeys = true) {
    try {
      await this.ensureLoaded();

      if (this.schema) {
        for (const key of Object.keys(query)) {
          const field = this.schema[key];

          if (!field) {
            continue;
          }
          if (typeof query[key] !== field.type) {
            throw new Error(
              `Find validation failed: Field '${key}' must be of type '${field.type}'.`
            );
          }

          if (
            field.validate &&
            typeof field.validate === "function" &&
            !field.validate(query[key])
          ) {
            throw new Error(
              `Find validation failed: Field '${key}' failed custom validation.`
            );
          }
        }
      }

      const results = [];
      const keys = Object.keys(this.data);

      for (const key of keys) {
        let match = true;

        for (const queryKey in query) {
          if (this.indexes[queryKey]) {
            const values = Array.isArray(query[queryKey])
              ? query[queryKey]
              : [query[queryKey]];

            if (!values.includes(this.data[key][queryKey])) {
              match = false;
              break;
            }
          } else {
            if (this.data[key][queryKey] !== query[queryKey]) {
              match = false;
              break;
            }
          }
        }

        if (match) {
          results.push(returnKeys ? key : this.data[key]);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to execute find operation: ${error.message}`);
    }
  }
  async insert(document) {
    await this.ensureLoaded();
    if (this.schema && !this.validateDocument(document)) {
      for (const key of Object.keys(this.schema)) {
        const field = this.schema[key];
        if (field.required && !document.hasOwnProperty(key)) {
          throw new Error(`Validation error: Field '${key}' is required.`);
        }
        if (
          document.hasOwnProperty(key) &&
          typeof document[key] !== field.type
        ) {
          throw new Error(
            `Validation error: Field '${key}' must be of type '${field.type}'.`
          );
        }
        if (
          field.validate &&
          typeof field.validate === "function" &&
          !field.validate(document[key])
        ) {
          throw new Error(
            `Validation error: Field '${key}' failed custom validation.`
          );
        }
      }
    }

    const key = document._id || Math.random().toString(36).substring(7);
    this.data[key] = document;

    for (const indexName in this.indexes) {
      const value = document[indexName];
      if (value !== undefined) {
        this.indexes[indexName][value] = this.indexes[indexName][value] || [];
        this.indexes[indexName][value].push(key);
      }
    }

    await this.save();
    return key;
  }
  async update(query, updates) {
    await this.ensureLoaded();

    if (this.schema) {
      for (const key of Object.keys(updates)) {
        const field = this.schema[key];
        if (!field) {
          continue;
        }
        if (typeof updates[key] !== field.type) {
          throw new Error(
            `Update validation failed: Field '${key}' must be of type '${field.type}'.`
          );
        }
        if (
          field.validate &&
          typeof field.validate === "function" &&
          !field.validate(updates[key])
        ) {
          throw new Error(
            `Update validation failed: Field '${key}' failed custom validation.`
          );
        }
      }
    }

    const results = await this.find(query);

    for (const result of results) {
      if (this.data[result]) {
        Object.assign(this.data[result], updates);
      }
    }

    await this.save();
    return results.length;
  }
  async remove(query) {
    await this.ensureLoaded();

    const results = await this.find(query);

    for (const result of results) {
      // console.log(result);
      delete this.data[result];
    }

    await this.save();
    return results.length;
  }
  getAll() {
    return this.data;
  }
  validateDocument(document) {
    if (!this.schema) {
      return true;
    }

    const schemaKeys = Object.keys(this.schema);
    const documentKeys = Object.keys(document);

    for (const key of schemaKeys) {
      if (this.schema[key].required && !documentKeys.includes(key)) {
        return false;
      }
    }

    for (const key of documentKeys) {
      const schema = this.schema[key];
      if (schema) {
        if (typeof document[key] !== schema.type) {
          return false;
        }
        if (schema.validate && typeof schema.validate === "function") {
          if (!schema.validate(document[key])) {
            return false;
          }
        }
      }
    }

    return true;
  }
  visualize() {
    console.table(Object.values(this.data));
  }
}

module.exports = JsonCrudDB;
