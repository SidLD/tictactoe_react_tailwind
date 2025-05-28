
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, Trophy, Clock, Crown, X, Circle } from "lucide-react"
import { toast } from "sonner"
import { createGame, getGameHistory } from "@/api/game.api"
import { auth } from "@/lib/service"

const MiniBoard = ({ board }: { board: (string | null)[] }) => {
  return (
    <div className="grid w-12 h-12 grid-cols-3 gap-1">
      {board.map((cell, index) => (
        <div
          key={index}
          className="flex items-center justify-center text-xs font-bold bg-gray-100 rounded"
        >
          {cell === 'X' && <X className="w-2 h-2 text-blue-600" />}
          {cell === 'O' && <Circle className="w-2 h-2 text-red-600" />}
        </div>
      ))}
    </div>
  )
}

const GameHistoryCard = ({ game }: { game: any }) => {
  const getStatusBadge = () => {
    if (game.status === 'won' && game.winner) {
      return (
        <Badge className="text-green-800 bg-green-100 border-green-200">
          <Crown className="w-3 h-3 mr-1" />
          {game.winner.username} Won
        </Badge>
      )
    } else if (game.status === 'draw') {
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Draw
        </Badge>
      )
    }
    return (
      <Badge variant="outline">
        In Progress
      </Badge>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MiniBoard board={game.board} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-blue-600">
                    {game.playerX.username}
                  </span>
                  <span className="text-xs text-gray-500">vs</span>
                  <span className="text-sm font-medium text-red-600">
                    {game.playerO.username}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  ID: {game._id.slice(-8)}...
                </div>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge()}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function TicTacToeHome() {
  const [player1, setPlayer1] = useState("")
  const [player2, setPlayer2] = useState("")
  const gameSession = auth.getUserInfo()

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

  const gameHistory = useQuery({
    queryKey: ['game-history'],
    queryFn: () => getGameHistory({}).then((data:any) => data.data),
  })

  const handleSubmit = () => {
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
    <div className="flex items-start justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex w-full max-w-4xl gap-6">
        {/* Main Game Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto lg:mx-0"
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
                    <div className="space-y-4">
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
                          onClick={handleSubmit}
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
                          {createGameMutation.isPending ? "Continue Game..." : "Continue"}
                        </Button>
                      </motion.div>
                    </div>
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
                          {gameSession?.players?.player1 || 'Player 1'} (X)
                        </Badge>
                        <Badge variant="outline" className="justify-center flex-1 py-2">
                          {gameSession?.players?.player2 || 'Player 2'} (O)
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

        {/* Game History Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Game History
              </CardTitle>
              <CardDescription>
                Previous games and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gameHistory.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-6 h-6 border-2 border-indigo-600 rounded-full border-t-transparent"
                  />
                </div>
              ) : gameHistory.error ? (
                <div className="py-8 text-center text-red-600">
                  Failed to load game history
                </div>
              ) : gameHistory.data?.history?.length > 0 ? (
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {gameHistory.data.history.map((game: any) => (
                    <GameHistoryCard key={game._id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Gamepad2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No games played yet</p>
                  <p className="text-sm">Start your first game to see history here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}