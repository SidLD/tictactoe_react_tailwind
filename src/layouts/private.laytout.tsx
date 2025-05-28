import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { LogOut, Menu, X, Users, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { auth } from "@/lib/service"
import { useQuery } from "@tanstack/react-query"
import { getPlayerDetaills } from "@/api/game.api"

interface GameScores {
  X: number
  O: number
  draws: number
}

interface PlayerInfo {
  player1: string
  player2: string
}

export default function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const [scores, setScores] = useState<GameScores>({ X: 3, O: 2, draws: 1 })
  const [players, setPlayers] = useState<PlayerInfo>({ player1: "Player 1", player2: "Player 2" })

  const gamePlayersDetails  = useQuery({
    queryKey: ['playerDetails'],
    queryFn: () => getPlayerDetaills({}).then(({data}:any) => data)
  });


  const handleLogout = () => {
    auth.clear()
    setTimeout(() => {
      navigate('/')
    }, 500)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
  if (gamePlayersDetails.data) {
    const {stats} = gamePlayersDetails.data as any;
    if(stats){
      const playerNames = Object.keys(stats)
      const [playerX, playerO] = playerNames

      setScores({
        X: stats[playerX]?.wins || 0,
        O: stats[playerO]?.wins || 0,
        draws: (stats[playerX]?.draws || 0) + (stats[playerO]?.draws || 0),
      })

      setPlayers({
        player1: playerX,
        player2: playerO,
      })
    }
  }
}, [gamePlayersDetails.data])


const ScoreDisplay = () => (
    <div className="flex flex-col py-4 space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:items-center">
      <div className="flex items-center space-x-2">
        <Gamepad2 className="w-8 h-8 text-indigo-600" />
        <span className="font-semibold">Tic Tac Toe</span>
      </div>
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4" />
        <span className="text-sm uppercase">
          {players.player1} vs {players.player2}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">{players.player1} (X):</span>
          <Badge variant="outline" className="text-blue-800 bg-blue-100 border-blue-300">
            {scores.X}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">{players.player2} (O):</span>
          <Badge variant="outline" className="text-red-800 bg-red-100 border-red-300">
            {scores.O}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">Draws:</span>
          <Badge variant="outline" className="text-gray-800 bg-gray-100 border-gray-300">
            {scores.draws}
          </Badge>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="text-white bg-gray-800">
        <nav className="container flex items-center justify-between mx-auto">
          <div className="flex items-center justify-between w-full py-4 md:hidden">
            <div className="flex items-center space-x-2">
               <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  className="flex justify-center "
                >
                  <Gamepad2 className="w-8 h-8 text-indigo-600" />
                </motion.div>
              <span className="text-xl font-bold">Game Dashboard</span>
            </div>
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className={`w-full ${isMenuOpen ? "block" : "hidden"} md:block mt-4 md:mt-0`}>
            <div className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 md:items-center">
              <div className="flex-1">
                <ScoreDisplay />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-700"
                  size="sm"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow p-0 m-0 ">
        <Outlet />
      </main>
    </div>
  )
}
