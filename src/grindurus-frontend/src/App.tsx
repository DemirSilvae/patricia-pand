import React, { useState, ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useProtocolContext } from './context/ProtocolContext'
import Header from './components/header/Header'
import Dashboard from './components/dashboard/Dashboard'
import ConnectWallet from './components/connect/ConnectWallet'
import GrETH from './components/grETH/GrETH'

type RouterGuardProps = {
  networkConfig: Record<string, any>
  isConnected: boolean
  children: ReactNode
}

const RouterGuard: React.FC<RouterGuardProps> = ({ networkConfig, isConnected, children }) => {
  if (!networkConfig || Object.keys(networkConfig).length === 0) {
    return <div>Loading network configuration...</div>
  }

  if (!isConnected) {
    return <ConnectWallet />
  }

  return <>{children}</>
}

function App() {
  const { networkConfig, isConnected } = useProtocolContext()

  return (
    <>
      <Header/>
      <main className="page">
        <Routes>
          <Route
            path="/"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <Dashboard/>
              </RouterGuard>
            }
          />
          <Route
            path="/greth"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <GrETH/>
              </RouterGuard>
            }
          />
          {/* <Route
            path="/grinder-ai"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <GrinderAIChat />
              </RouterGuard>
            }
          />
          <Route
            path="/pool/:poolId"
            element={
              <RouterGuard networkConfig={networkConfig} isConnected={isConnected}>
                <Pool />
              </RouterGuard>
            }
          /> */}
        </Routes>
      </main>
    </>
  )
}

export default App