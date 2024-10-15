
<template>
   <section class="flex cover" id="root">
      
      <LoginPage
         @enterGame ="connectExpress"
      />

      <GamePage v-if="isLogged"
         :socket ="socket"
      />

   </section>
</template>


<script lang="ts">

   // Components 
   import LoginPage   from "./components/pages/LoginPage.vue"
   import GamePage    from "./components/pages/GamePage.vue"

   // Scripts
   import { IString } from "./scripts/utils/interfaces";
   import { io      } from "socket.io-client";
   
   export default {
      name: "App",

      components: {
         LoginPage,
         GamePage,
      },

      data() {
      return {
         URL:     "http://localhost:3000",
         isLogged: false,
         socket:   null,

         accName:  null, // ==> Tempory
      }},

      methods: {

         async connectExpress(inputField: IString) {
            
            try {
               const response = await fetch(`${this.URL}/login`, {
                  method:    "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ auth: true }),
               });
               
               const { data } = await response.json();
               
               if(!data.success) throw Error;

               this.accName = inputField.name;
               this.connectSocketIO();
            }
            
            catch(error) {
               console.log(error);
            }
         },

         connectSocketIO() {

            this.socket = io(this.URL, {
               transports:      ["websocket", "polling"],
               withCredentials: true,
            });

            this.socket.on("connected", () => {
               this.isLogged = true;
            });
         },
      },
   }
</script>


<style lang="scss">

   html * {
      /* Reset */
      margin: 0;
      padding: 0;
      cursor: url("../public/GUI/cursors.png"), auto !important;
   }

   .cover {
      position: fixed;
      height:   100%;
      width:    100%;
      background-color: rgb(60, 60, 60);
   }

   .flex {
      /* flexCenter */
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
   }  

   p,
   input,
   button {
      font-family: "Verdana";
      font-size: 22px;
      text-align: center;
   }

   input,
   button {
      border: none;
      background: none;
   }
</style>
