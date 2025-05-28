import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Users, Loader2, AlertCircle } from 'lucide-react'
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getGameStatus, resetGame, makeMove, createGame } from "@/api/game.api"
import { auth } from "@/lib/service"

type Player = "X" | "O" | null
type GameStatus = "playing" | "won" | "draw"

interface GameState {
  board: Player[]
  currentPlayer: Player
  status: GameStatus
  winner: Player | any
  winningLine: number[] | null
}

interface PlayerInfo {
  name: string
  symbol: Player
}

export default function TicTacToeBoard() {
  const [players] = useState<{ player1: PlayerInfo; player2: PlayerInfo }>({
    player1: { name: "Player 1", symbol: "X" },
    player2: { name: "Player 2", symbol: "O" },
  })

  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    status: "playing",
    winner: null,
    winningLine: null,
  })

  const [drawAnimationActive, setDrawAnimationActive] = useState(false)

  const {
    data: gameStatusData,
    isLoading: isLoadingGame,
    refetch: refetchGameStatus,
  } = useQuery({
    queryKey: ["gameStatus"],
    queryFn: () => getGameStatus({}).then(({ data }: any) => data),
    refetchOnWindowFocus: false,
  })

  const makeMoveMutation = useMutation({
    mutationFn: (index: number) => makeMove({ index, symbol: gameState.currentPlayer }).then(({ data }: any) => data),
    onSuccess: (data: any) => {
      setGameState({
        board: data.board || gameState.board,
        currentPlayer: data.currentPlayer || gameState.currentPlayer,
        status: data.status || gameState.status,
        winner: data.winner || null,
        winningLine: data.winningLine || null,
      })

      if (data.isFinished && data.winner && data.winner !== "Draw") {
        toast.success(`🎉 ${getWinnerName(data.winner)} wins!`)
      } else if (data.isFinished && data.winner === "Draw") {
        toast.info("It's a draw!")
        setDrawAnimationActive(true)
      }
      refetchGameStatus()
    },
    onError: (error: any) => {
      toast.error("Failed to make move. Please try again.")
      console.error("Move error:", error)
    },
  })

  const resetGameMutation = useMutation({
    mutationFn: () => resetGame({}).then(({ data }: any) => data),
    onSuccess: (data) => {
      setGameState({
        board: data.board || Array(9).fill(null),
        currentPlayer: data.turn || "X",
        status: "playing",
        winner: null,
        winningLine: null,
      })
      setDrawAnimationActive(false)
      toast.success("Game reset successfully!")
      refetchGameStatus()
    },
    onError: (error: any) => {
      toast.error("Failed to reset game. Please try again.")
      console.error("Reset error:", error)
    },
  })

  const newGame = useMutation({
    mutationFn: createGame,
    onSuccess: ({data}:any) => {
      auth.storeToken(data.token)
      toast(`${data.logs[0]}`, {
        description: "Your tic-tac-toe game is ready to start.",
      })
      window.location.reload()
    },
    onError: () => {
      toast('Error', {
        description: "Failed to create game session. Please try again.",
      })
    },
  })

  const handleNewGame = async () => {
    const gameInfo = auth.getUserInfo()
    newGame.mutate({ playerXName: gameInfo.players[0].username.trim(), playerOName: gameInfo.players[1].username.trim() })
  }

  const handleStop = async () => {
    auth.clear()
  }

  useEffect(() => {
    if (gameStatusData) {
      const status = gameStatusData.isFinished
        ? gameStatusData.winner === "Draw"
          ? "draw"
          : gameStatusData.winner
          ? "won"
          : "playing"
        : "playing"

      setGameState({
        board: gameStatusData.board || Array(9).fill(null),
        currentPlayer: gameStatusData.turn || "X",
        status: status,
        winner: gameStatusData.winner || null,
        winningLine: gameStatusData.winningLine || null,
      })

      // Set draw animation if game is finished with a draw
      if (gameStatusData.isFinished && gameStatusData.winner === "Draw") {
        setDrawAnimationActive(true)
      } else {
        setDrawAnimationActive(false)
      }
    }
  }, [gameStatusData])

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.status !== "playing" || makeMoveMutation.isPending) {
      return
    }
    makeMoveMutation.mutate(index)
  }

  const handleResetGame = () => {
    if (resetGameMutation.isPending) return
    resetGameMutation.mutate()
  }

  const getCurrentPlayerName = () => {
    return gameState.currentPlayer === "X" ? players.player1.name : players.player2.name
  }

  const getWinnerName = (winner?: Player | any) => {
    const winnerPlayer = winner ?? gameState.winner
    if (!winnerPlayer || winnerPlayer === "Draw") return ""
    return winnerPlayer.username || (winnerPlayer === "X" ? players.player1.name : players.player2.name)
  }

  if (isLoadingGame) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Loading game...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Game Status
                </span>
                <Button variant="outline" size="sm" onClick={handleResetGame} disabled={resetGameMutation.isPending}>
                  {resetGameMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-1" />
                  )}
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {gameState.status === "playing" && (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <CardDescription className="mb-2">Current Turn</CardDescription>
                    <Badge variant="outline" className="px-4 py-2 text-lg">
                      {getCurrentPlayerName()} ({gameState.currentPlayer})
                    </Badge>
                    {makeMoveMutation.isPending && (
                      <div className="flex items-center justify-center mt-2 space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">Making move...</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {gameState.status === "won" && (
                  <motion.div
                    key="won"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="flex items-center justify-center gap-2 mb-2"
                    >
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <span className="text-lg font-semibold text-green-600">Winner!</span>
                    </motion.div>
                    <Badge className="px-4 py-2 text-lg text-green-800 bg-green-100">
                      {getWinnerName()}
                    </Badge>
                   <div className="flex justify-center gap-4 mt-6">
                      <Button
                        onClick={handleNewGame}
                        className="px-6 py-2 text-white transition duration-200 bg-green-600 shadow-md hover:bg-green-700 rounded-2xl"
                      >
                        🆕 New Game
                      </Button>

                      <Button
                        onClick={handleStop}
                        className="px-6 py-2 text-white transition duration-200 bg-red-600 shadow-md hover:bg-red-700 rounded-2xl"
                      >
                        🛑 Stop
                      </Button>
                    </div>
                  </motion.div>
                )}

                {gameState.status === "draw" && (
                  <motion.div
                    key="draw"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex items-center justify-center gap-2 mb-2"
                    >
                      <AlertCircle className="w-6 h-6 text-amber-500" />
                      <span className="text-lg font-semibold text-amber-600">Draw Game!</span>
                    </motion.div>
                    <Badge variant="outline" className="px-4 py-2 text-lg bg-amber-50 text-amber-800 border-amber-200">
                      {"No Winner - It's a Draw!"}
                    </Badge>
                     <div className="flex justify-center gap-4 mt-6">
                      <Button
                        onClick={handleNewGame}
                        className="px-6 py-2 text-white transition duration-200 bg-green-600 shadow-md hover:bg-green-700 rounded-2xl"
                      >
                        🆕 New Game
                      </Button>

                      <Button
                        onClick={handleStop}
                        className="px-6 py-2 text-white transition duration-200 bg-red-600 shadow-md hover:bg-red-700 rounded-2xl"
                      >
                        🛑 Stop
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid max-w-sm grid-cols-3 gap-3 mx-auto aspect-square">
                {gameState.board.map((cell, index) => (
                  <motion.button
                    key={index}
                    className={`
                      relative aspect-square rounded-lg border-2 transition-all duration-200
                      ${cell ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50"}
                      ${gameState.winningLine?.includes(index) ? "border-green-400 bg-green-50" : ""}
                      ${drawAnimationActive ? "border-amber-300 bg-amber-50" : ""}
                      ${gameState.status !== "playing" || makeMoveMutation.isPending ? "cursor-not-allowed" : "cursor-pointer"}
                      ${makeMoveMutation.isPending ? "opacity-70" : ""}
                    `}
                    onClick={() => handleCellClick(index)}
                    disabled={gameState.status !== "playing" || !!cell || makeMoveMutation.isPending}
                    whileHover={
                      !cell && gameState.status === "playing" && !makeMoveMutation.isPending ? { scale: 1.05 } : {}
                    }
                    whileTap={
                      !cell && gameState.status === "playing" && !makeMoveMutation.isPending ? { scale: 0.95 } : {}
                    }
                    animate={
                      drawAnimationActive
                        ? {
                            borderColor: ["#fcd34d", "#fbbf24", "#f59e0b", "#fbbf24", "#fcd34d"],
                            boxShadow: [
                              "0 0 0 rgba(251, 191, 36, 0)",
                              "0 0 5px rgba(251, 191, 36, 0.3)",
                              "0 0 8px rgba(251, 191, 36, 0.5)",
                              "0 0 5px rgba(251, 191, 36, 0.3)",
                              "0 0 0 rgba(251, 191, 36, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={
                      drawAnimationActive
                        ? {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: index * 0.1, // Staggered animation
                          }
                        : {}
                    }
                  >
                    <AnimatePresence>
                      {cell && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          className={`
                            absolute inset-0 flex items-center justify-center text-4xl font-bold
                            ${cell === "X" ? "text-blue-600" : "text-red-500"}
                            ${gameState.winningLine?.includes(index) ? "text-green-600" : ""}
                            ${drawAnimationActive ? "text-amber-600" : ""}
                          `}
                        >
                          {cell}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!cell && gameState.status === "playing" && !makeMoveMutation.isPending && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.3 }}
                        className={`
                          absolute inset-0 flex items-center justify-center text-4xl font-bold
                          ${gameState.currentPlayer === "X" ? "text-blue-600" : "text-red-500"}
                        `}
                      >
                        {gameState.currentPlayer}
                      </motion.div>
                    )}

                    {makeMoveMutation.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                      </div>
                    )}

                    {/* Draw animation overlay */}
                    {drawAnimationActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: index * 0.1,
                        }}
                        className="absolute inset-0 rounded-md pointer-events-none bg-amber-100"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Draw pattern visualization */}
              {drawAnimationActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mt-4"
                >
                  <div className="flex items-center px-4 py-2 space-x-2 border rounded-md text-amber-600 bg-amber-50 border-amber-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">All cells filled with no winner</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
