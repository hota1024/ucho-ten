'use client'

import { faAt, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Card,
  Input,
  Loading,
  Spacer,
  Text,
  useInput,
} from '@nextui-org/react'
import { FormEvent, ReactEventHandler } from 'react'

export interface LoginFormProps {
  errorMessage?: string | null
  loading?: boolean

  onSubmit: (values: { identifier: string; password: string }) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const { errorMessage, loading, onSubmit } = props

  const { value: identifier, bindings: bindIdentifier } = useInput('')
  const { value: password, bindings: bindPassword } = useInput('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({ identifier, password })
  }

  return (
    <Card as="form" onSubmit={handleSubmit} css={{ mw: '420px', p: '$8' }}>
      <Card.Header>
        <Text b>ログイン</Text>
      </Card.Header>

      <Card.Body>
        {errorMessage && (
          <Text color="error" css={{ mb: '$10' }}>
            {errorMessage}
          </Text>
        )}

        <Input
          {...bindIdentifier}
          name="handle"
          placeholder="ハンドル"
          contentLeft={<FontAwesomeIcon icon={faAt} />}
          required
          disabled={loading}
        />
        <Spacer y={1} />
        <Input.Password
          {...bindPassword}
          name="password"
          placeholder="パスワード"
          contentLeft={<FontAwesomeIcon icon={faLock} />}
          required
          disabled={loading}
        />
      </Card.Body>

      <Card.Footer>
        <Button type="submit" disabled={loading} css={{ width: '100%' }}>
          {loading ? <Loading size="xs" /> : 'サインイン'}
        </Button>
      </Card.Footer>
    </Card>
  )
}
