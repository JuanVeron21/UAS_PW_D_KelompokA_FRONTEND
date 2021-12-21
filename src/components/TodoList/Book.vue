<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Book </h3>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="books" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                    <v-icon small @click="deleteHandler(item.id)"> mdi-delete </v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card color="white">
                <v-card-title>
                    <span class="headline">{{ formTitle }} Book</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.judul" label="Judul" required></v-text-field>
                        <v-text-field v-model="form.penulis" label="Penulis" required></v-text-field>
                        <v-text-field v-model="form.penerbit" label="Penerbit" required></v-text-field>
                        <v-text-field v-model="form.tahun" label="Tahun" required></v-text-field>
                        <v-text-field v-model="form.stok" label="Stok" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>
                    Anda Yakin ingin menghapus buku ini?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "Book",
    data() {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: 'orange',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                { text: "Judul", value: "judul" },
                { text: "Penulis", value: "penulis" },
                { text: "Penerbit", value: "penerbit" },
                { text: "Tahun", value: "tahun" },
                { text: "Stok", value: "stok" },
                { text: "Actions", value: "actions" },
            ],
            book: new FormData,
            books: [],
            form: {
                judul: null,
                penulis: null,
                penerbit: null,
                tahun: null,
                stok: null
            },
            deleteId: '',
            editId: ''
        };
    },
    methods: {
        setForm(){
            if(this.inputType !== 'Tambah'){
                this.update();
            }else{
                this.save();
            }
        },
        readData() {
            var url = this.$api + '/book';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.books = response.data.data;
            })
        },
        save() {
            this.book.append('judul', this.form.judul);
            this.book.append('penulis', this.form.penulis);
            this.book.append('penerbit', this.form.penerbit);
            this.book.append('tahun', this.form.tahun);
            this.book.append('stok', this.form.stok);

            var url = this.$api + '/book/'
            this.load = true;
            this.$http.post(url, this.book, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        update(){
            let newData = {
                judul : this.form.judul,
                penulis : this.form.penulis,
                penerbit : this.form.penerbit,
                tahun : this.form.tahun,
                stok : this.form.stok
            };

            var url = this.$api + '/book/' + this.editId;
            this.load = true;
            this.$http.put(url, newData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        deleteData(){
            var url = this.$api + '/book/' + this.deleteId;
            this.load = true;
            this.$http.delete(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
                this.inputType = "Tambah";
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.judul = item.judul;
            this.form.penulis = item.penulis;
            this.form.penerbit = item.penerbit;
            this.form.tahun = item.tahun;
            this.form.stok = item.stok;
            this.dialog = true;
        },
        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        close() {
            this.dialog = false;
            this.inputType = 'Tambah';
            this.dialogConfirm = false;
            this.readData();
        },
        cancel() {
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },
        resetForm() {
            this.form = { judul: null,
                penulis: null,
                penerbit: null,
                tahun: null,
                stok: null };
        },
    },
    computed: {
        formTitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.readData();
    },
};
</script>