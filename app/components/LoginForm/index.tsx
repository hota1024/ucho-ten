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
    event.preventDefault();
    if (/^[a-zA-Z0-9-]+$/.test(identifier)) {
      onSubmit({ identifier: identifier + ".bsky.social", password });
    } else {
      onSubmit({ identifier, password });
    }
  };

  return (
    <Card as="form" onSubmit={handleSubmit} css={{ mw: '420px', p: '$8' }}>
      <Card.Header>
        <Text b>Sign in to Bluesky</Text>
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
          placeholder="Handle or your domain"
          aria-label="handle"
          contentLeft={<FontAwesomeIcon icon={faAt} />}
          required
          disabled={loading}
        />
        <Spacer y={1} />
        <Input.Password
          {...bindPassword}
          name="password"
          placeholder="Password"
          aria-label="password"
          contentLeft={<FontAwesomeIcon icon={faLock} />}
          required
          disabled={loading}
        />
      </Card.Body>

      <Card.Footer>
        <Button type="submit" disabled={loading} css={{ width: '100%' }}>
          {loading ? <Loading size="xs" /> : 'Sign in'}
        </Button>
      </Card.Footer>
    </Card>
  )
}
