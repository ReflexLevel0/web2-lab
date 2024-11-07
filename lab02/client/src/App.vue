<script>
import alasql from "alasql";

export default {
  data() {
    return {
      people: [],
      filteredPeople: [],
      injectionEnabled: false,
      name_input_text: "",
    };
  },
  mounted() {
    //alasql("DROP TABLE IF EXISTS person");
    alasql(
      "CREATE TABLE IF NOT EXISTS person(id SERIAL PRIMARY KEY, first_name VARCHAR(64), last_name VARCHAR(64))",
    );
    if (alasql.tables.person.data.length == 0) {
      alasql(
        "INSERT INTO person(first_name, last_name) VALUES ('Pero', 'Perić'),('Ante', 'Antić'),('Pero', 'Perković')",
      );
    }
    //alasql("DROP VIEW IF EXISTS personView");
    alasql(
      'CREATE VIEW IF NOT EXISTS personView AS SELECT person.*, first_name || " " || last_name as full_name FROM person',
    );
    this.$data.people = alasql("SELECT * FROM personView");
    this.$data.filteredPeople = this.$data.people;
  },
  methods: {
    filterPeople() {
      let sql_string = "";
      let filtered = [];
      let name = this.$data.name_input_text;
      if (this.$data.injectionEnabled) {
        sql_string =
          'SELECT * FROM personView WHERE full_name LIKE "%' + name + '%"';
        filtered = alasql(sql_string);
      } else {
        sql_string = "SELECT * FROM personView WHERE full_name LIKE ?";
        filtered = alasql(sql_string, ["%" + name + "%"]);
      }
      this.$data.filteredPeople = filtered;
    },
  },
};
</script>

<template>
  <div>
    <label for="sql-injection-input">SQL injection</label>
    <input
      id="sql-injection-input"
      type="checkbox"
      @input="
        (input) => {
          this.$data.injectionEnabled = input.srcElement.checked;
          this.filterPeople();
        }
      "
    />

    <br />

    <label for="name-input">Name search: </label>
    <input
      id="name-input"
      type="text"
      v-model="name_input_text"
      @input="() => this.filterPeople()"
    />

    <div :key="person.id" v-for="person in this.$data.filteredPeople">
      <div>{{ person }}</div>
    </div>
  </div>
</template>

<style scoped></style>
