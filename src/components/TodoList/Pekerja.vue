<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Pekerja </h3>
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
            <v-data-table :headers="headers" :items="pekerjas" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editHandler(item)"> mdi-pencil </v-icon>
                    <v-icon small @click="deleteHandler(item.id)"> mdi-delete </v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card color="white">
                <v-card-title>
                    <span class="headline">{{ formTitle }} Pinjam</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_pekerja" label="Nama Pekerja" required></v-text-field>
                        <v-text-field v-model="form.no_pekerja" label="No Pekerja" required></v-text-field>
                        <v-text-field v-model="form.lama_kerja" label="Lama Kerja" required></v-text-field>
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
                    Anda Yakin ingin menghapus pekerja ini?
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
    name: "Pekerja",
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
                { text: "Nama Pekerja", value: "nama_pekerja" },
                { text: "No Pekerja", value: "no_pekerja" },
                { text: "Lama Kerja", value: "lama_kerja" },
                { text: "Actions", value: "actions" },
            ],
            pekerja: new FormData,
            pekerjas: [],
            form: {
                nama_pekerja: null,
                no_pekerja: null,
                lama_kerja: null
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
            var url = this.$api + '/pekerja';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.pekerjas = response.data.data;
            })
        },
        save() {
            this.pekerja.append('nama_pekerja', this.form.nama_pekerja);
            this.pekerja.append('no_pekerja', this.form.no_pekerja);
            this.pekerja.append('lama_kerja', this.form.lama_kerja);

            var url = this.$api + '/pekerja/'
            this.load = true;
            this.$http.post(url, this.pekerja, {
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
                nama_pekerja : this.form.nama_pekerja,
                no_pekerja : this.form.no_pekerja,
                lama_kerja : this.form.lama_kerja
            };

            var url = this.$api + '/pekerja/' + this.editId;
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
            var url = this.$api + '/pekerja/' + this.deleteId;
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
            this.form.nama_pekerja = item.nama_pekerja;
            this.form.no_pekerja = item.no_pekerja;
            this.form.lama_kerja = item.lama_kerja;
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
            this.form = { nama_pekerja: null,
                no_pekerja: null,
                lama_kerja: null};
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