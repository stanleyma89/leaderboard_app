import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ScoreBoard } from "./pages/ScoreBoard/ScoreBoard";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/scoreboard" replace />} />
        <Route path="/scoreboard" element={<ScoreBoard />} />
      </Routes>
    </QueryClientProvider>
  );
};
