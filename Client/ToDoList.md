
   - Use server
   - Use mongoDB to save & load
   
   - pathfinder approx when can't reach (inside closed walls for ex.)
   - trigger transparency with radius


   <!-- Later on -->
   ==> Game features:
   - mini map
   - buildings class
   - ressources system
   - images loader class/file
   - agents attack & health system
   - worker class (gather ressources + build buildings)
   - --- WFC map generator class ---
   - wall direction type (option)


   <!-- Web pages -->
   ==> Screens types:
   - Login: login account, create account
   - Menu:  single player, multiplayer, load game, (options)
   - lobby: battle's map & settings (faction color, max pop, map style, ressources qty)


   <!-- Ressources types -->
   ==> Ressources ideas
   - food
   - stone
   - wood
   - coal
   - iron   ore
   - iron   bar
   - gold   ore
   - gold   coins (money)


<!-- Express -->

   <!-- Login -->
   > Generate id from server
   ==> store LS Bear Token

   <!-- Lobby -->
   > create new battle
   ==> send data at /host
   ==> add battle to battlesList & enable joining

   /host, {
      hostID: 1,

      playersList: [
         { id: 1, name: "Illidan", faction: "Orange" },
      ],
      
      settings: { //params infos },
   }

   <!-- * update all joined players on settings changes -->
   <!-- * Need to add var & data checks in server to verify client's infos -->

   > startGame btn clicked
   ==> get all players: id, names, faction color
   ==> get battle params
   ==> send data at /create

<!-- SocketIO -->

   > When received battle's specs and all players infos from /create
   ==> start socketIO for each player
   ==> create new battle instance
   ==> send back all the battle infos to all players
   ==> load GamePage in client after everyone been connected & all initialized

   <!-- * Need to add var & data checks in server to verify client's infos -->

   /create, {
      hostID: 1,

      playersList: [
         { id: 1, name: "Illidan",   faction: "Orange" },
         { id: 2, name: "Malfurion", faction: "Purple" },
         { id: 3, name: "Garrosh",   faction: "Red"    },
         { id: 4, name: "Varian",    faction: "Blue"   },
      ],
      
      settings: { //params infos },
   }



cur
-50
120
80

tar
10
280
170

dx = 10 +50    = 60
dy = 280 -120  = 160
dz = 170 -80   = 90

dist = 193

ux = 60  / 193 = 0.311
uy = 160 / 193 = 0.829
uz = 90  / 193 = 0.466

            v mm /s
stepSize = 120  * (35 / 1000) = 4.2

cur.x += 0.311 *4.2 += 1.31 mm
cur.y += 0.829 *4.2 += 3.48 mm
cur.z += 0.466 *4.2 += 1.95 mm


cur.x += 4.2 every 35 ms