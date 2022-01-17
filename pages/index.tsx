import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../src/contexts/AuthContext'
import styles from '../styles/Home.module.css'
import { withSSRGuest } from '../src/utils/withSSRGuest'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useContext(AuthContext)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <div className={styles.mainContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
        <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
        <button type="submit">Entrar</button>
      </form>
    </div>

  )
}


export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})