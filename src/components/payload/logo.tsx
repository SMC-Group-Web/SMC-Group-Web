export const Logo = () => {
  return (
    <div style={{
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
    }}>
      <img
        src="/logo-smc.png"
        alt="SMC Group"
        style={{
          width: '150px',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export const Icon = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src="/logo-smc.ico"
        alt="SMC"
        style={{
          width: '32px',
          height: '32px',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}