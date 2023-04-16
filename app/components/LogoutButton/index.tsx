import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Loading } from '@nextui-org/react'
import { useState } from 'react'

export const LogoutButton = () => {
  const [loading, setLoading] = useState(false)

  const logout = () => {
    setLoading(true)

    localStorage.removeItem('session')
    window.location.href = '/login'
  }
  const styles = {
    button: {
      color: '$error',
      backgroundColor: '$white',
      borderColor: '$error',
      '&:hover': {
        color: '$white',
        backgroundColor: '$error',
      },
    },
  }

  return (
    <Button
      css={styles.button}
      bordered
      color="error"
      onPress={logout}
      disabled={loading}
      icon={<FontAwesomeIcon icon={faSignOut} size="lg" />}
    >
      {loading ? <Loading color="error" size="sm" /> : 'サインアウト'}
    </Button>
  )
}
