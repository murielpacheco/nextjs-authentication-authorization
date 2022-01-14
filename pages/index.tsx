import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const data = {
      email,
      password
    }

    console.log(data )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home
