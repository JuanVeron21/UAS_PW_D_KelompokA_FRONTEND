<template>
    <main>
        <v-container fluid fill-height class="posisinya">
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm6 elevation-6>
                    <v-toolbar class="deep-purple darken-4">
                        <v-toolbar-title class="text" >
                            <h1>REGISTER</h1>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card>
                        <v-card-text class="pt-4">
                            <div>
                                <v-form v-model="valid" ref="form">
                                    <v-text-field label="Nama" v-model="name" :rules="nameRules" required></v-text-field>
                                    <v-text-field label="E-mail" v-model="email" :rules="emailRules" required></v-text-field>
                                    <v-text-field label="Password" v-model="password" type="password" min="8" :rules="passwordRules" counter required></v-text-field>
                                    <v-layout justify-end>
                                        <v-btn class="mr-2" @click="login" :class="{ 'grey darken-1 white--text' : valid, disabled: !valid}">Login</v-btn>
                                        <v-btn class="mr-2" @click="submit" :class="{ 'grey darken-1 white--text' : valid, disabled: !valid}">Go</v-btn>
                                        <v-btn class="mr-2" @click="clear" :class="{ 'grey darken-1 white--text' : valid, disabled: !valid}">Clear</v-btn>
                                    </v-layout>
                                </v-form>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;400&display=swap');
    .text{
        font-family: 'Roboto Slab', serif;
        color:aliceblue;
        margin-left: 125px;
    }

    .posisinya{
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
    }
</style>

<script>
    export default {
        name: "Register",
        data(){
            return {
                load:false,
                snackbar: false,
                error_message: '',
                color: '',
                valid: false,
                password: '',
                passwordRules:[
                    (v) => !!v || 'Password tidak boleh kosong :(',
                ],
                email: '',
                emailRules: [
                    (v) => !!v || 'Email tidak boleh kosong :(',
                ],
                name: '',
                nameRules:[
                    (v) => !!v || 'Nama tidak boleh kosong :(',
                ]
            };
        },
    
    methods: {
        submit(){
            if(this.$refs.form.validate())
            {
                this.load = true;
                this.$http.post (this.$api + '/register', {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                }).then(response => {
                    localStorage.setItem('id',response.data.user.id);
                    localStorage.setItem('token',response.data.access_token);
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.clear();
                    this.$router.push({
                        name: 'Login',
                    });
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = 'red';
                    this.snackbar = true;
                    this.load = false;
                });
            }
        },

        login()
        {
            this.$router.push({
                name: 'Login',
            });
        },

        clear()
        {
            this.$refs.form.reset()
        }
    },
    };
</script>