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
    alasql(
      "CREATE TABLE IF NOT EXISTS person(id SERIAL PRIMARY KEY, first_name VARCHAR(64), last_name VARCHAR(64))",
    );
    if (alasql.tables.person.data.length == 0) {
      alasql(
        "INSERT INTO person(first_name, last_name) VALUES ('Pero', 'Perić'),('Ante', 'Antić'),('Pero', 'Perković')",
      );
    }
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
        try {
          sql_string =
            'SELECT * FROM personView WHERE full_name LIKE "%' + name + '%"';
          filtered = alasql(sql_string);
        } catch {
          filtered = [];
        }
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
    <h2>SQL Injection</h2>
    <p>
      Upute: "klikom na SQL injection enabled" omogućuje se SQL Injection. Može
      se na primjer upisati tekst '<b>%" OR 1=1 OR "%</b>' (bez jednostrukih
      navodnika na početku i kraju!) kako bi se dohvatile sve osobe.
      Isključivanjem SQL Injection-a i upisom tog istog teksta se taj napad
      onemogućuje te se ne ispisuje niti jedna osoba.
    </p>
    <label for="sql-injection-input">SQL Injection ranjivost omogućena: </label>
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

    <br /><br />

    <label for="name-input">Pretraga osoba: </label>
    <input
      id="name-input"
      type="text"
      v-model="name_input_text"
      @input="() => this.filterPeople()"
    />

    <ul :key="person.id" v-for="person in this.$data.filteredPeople">
      <li>{{ person.full_name }}</li>
    </ul>
  </div>
</template>
