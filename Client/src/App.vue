
<template>
   <section class="flex cover" id="root">
      
      <LoginPage v-if="isLogin" class="page"
         @userLogin   ="logUser"
      />

      <MenuPage  v-if="isMenu"  class="page"
         @accessMulti ="toggleMulti"
      />

      <LobbyPage v-if="isLobby" class="page"
         @enterGame   ="loadGame"
      />

      <GamePage  v-if="isGame"
         :socket     ="socket"
         :unitParams ="unitParams"
         :gridParams ="gridParams"
      />

   </section>
</template>


<script lang="ts">

   // Components 
   import LoginPage   from "./components/pages/LoginPage.vue"
   import MenuPage    from "./components/pages/MenuPage.vue"
   import LobbyPage   from "./components/pages/LobbyPage.vue"
   import GamePage    from "./components/pages/GamePage.vue"

   // Scripts
   import { IString } from "./scripts/utils/interfaces";
   import { io      } from "socket.io-client";
   
   export default {
      name: "App",

      components: {
         LoginPage,
         MenuPage,
         LobbyPage,
         GamePage,
      },

      data() {
      return {
         URL:          "http://localhost:3000",

         // isLogin:       true,
         
         isMenu:        false,
         isLobby:       false,
         isGame:        false,

         socket:        null,
         unitParams:    null,
         gridParams:    null,
         userName:      null, // ==> Tempory
      }},

      mounted() {
         this.easyLaunch();
      },

      methods: {

         easyLaunch() {
            setTimeout(async () => {
               
               if(!await this.connectExpress()) return console.log("Failed to connect Express");
               
               this.userName = "Malfurion";
               this.isLogin  = false;
               this.loadGame({
                  faction: "Orange",
                  mapSize: "small",
               });

            }, 0);
         },



         async logUser(inputField: IString) {

            try {
               if(!await this.connectExpress()) throw Error;
               
               this.userName = inputField.name;
               this.isLogin  = false;
               this.isMenu   = true;
            }
            
            catch(error) {
               console.log(error);
            }
         },

         async connectExpress() {
            
            const response = await fetch(`${this.URL}/login`, {
               method:    "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ auth: true }),
            });
            
            const { data } = await response.json();
            
            if(!data || !data.success) return false;

            return true;
         },

         connectSocketIO() {

            this.socket = io(this.URL, {
               transports:      ["websocket", "polling"],
               withCredentials: true,
            });
         },

         toggleMulti() {
            this.isMenu  = false;
            this.isLobby = true;
         },

         loadGame(battleSpecs: any) {
            
            this.connectSocketIO();
            
            if(!this.socket) return console.log({ Error: "Failed to connect SocketIO !"});

            this.socket.on("connected", () => {
               this.socket.emit("setParams", { name: this.userName, ...battleSpecs });
            });

            this.socket.on("startGame", (data: any) => {
               this.unitParams = data.unitParams;
               this.gridParams = data.gridParams;
               this.isLobby    = false;
               this.isGame     = true;
            }, console.log("Game is starting !"));
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
   label,
   input,
   select,
   button {
      font-family: "Verdana";
      font-size: 22px;
      text-align: center;
   }




   // ***************************************************
   // Tempory
   // ***************************************************
   .page {

      input,
      button {
         margin: 20px;
         height: 50px;
         border: 4px double black;
         border-radius: 8px;
         background: silver;
         color: white;
         text-shadow: black 2px 2px 4px;
      }
      
      input {
         text-align: left;
         width: 80%;
         padding-left: 20px;
      }
   
      button {
         margin: 50px;
         width: 60%;
         background: linear-gradient(to bottom,
            green,
            lime,
            white,
            lime,
            green
         );
      }
   
      button:active {
         margin: 55px;
         width:  55%;
         height: 40px;
      }
   }

</style>
