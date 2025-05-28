import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, Trophy } from "lucide-react"
import { toast } from "sonner"
import { createGame } from "@/api/game.api"
import { auth } from "@/lib/service"


export default function TicTacToeHome() {
  const [player1, setPlayer1] = useState("")
  const [player2, setPlayer2] = useState("")
  const gameSession = auth.getUserInfo();

  const createGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: ({data}:any) => {
      auth.storeToken(data.token)
      toast(`${data.logs[0]}`, {
        description: "Your tic-tac-toe game is ready to start.",
      })
    },
    onError: () => {
      toast('Error', {
        description: "Failed to create game session. Please try again.",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (player1.trim() && player2.trim()) {
      createGameMutation.mutate({ playerXName: player1.trim(), playerOName: player2.trim() })
    }
  }

  const resetForm = () => {
    auth.clear()
    setPlayer1("")
    setPlayer2("")
    createGameMutation.reset()
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Gamepad2 className="w-16 h-16 text-indigo-600" />
          </motion.div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Tic Tac Toe</h1>
          <p className="text-gray-600">Enter player names to start your game</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!gameSession ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Player Setup
                  </CardTitle>
                  <CardDescription>Enter the names of both players to create a new game session</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="player1">Player 1 (X)</Label>
                      <Input
                        id="player1"
                        type="text"
                        placeholder="Enter Player 1 name"
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                        className="mt-1"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="player2">Player 2 (O)</Label>
                      <Input
                        id="player2"
                        type="text"
                        placeholder="Enter Player 2 name"
                        value={player2}
                        onChange={(e) => setPlayer2(e.target.value)}
                        className="mt-1"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={createGameMutation.isPending || !player1.trim() || !player2.trim()}
                      >
                        {createGameMutation.isPending ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent"
                          />
                        ) : (
                          <Trophy className="w-4 h-4 mr-2" />
                        )}
                        {createGameMutation.isPending ? "Creating Game..." : "Create Game"}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Trophy className="w-5 h-5" />
                    </motion.div>
                    Game Session Created!
                  </CardTitle>
                  <CardDescription>Your tic-tac-toe game is ready. Share the token with your opponent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Players</Label>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="justify-center flex-1 py-2">
                        {gameSession.players.player1} (X)
                      </Badge>
                      <Badge variant="outline" className="justify-center flex-1 py-2">
                        {gameSession.players.player2} (O)
                      </Badge>
                    </div>
                  </div>


                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Start Game</Button>
                    <Button variant="outline" onClick={resetForm}>
                      New Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
