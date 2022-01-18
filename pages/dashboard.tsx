import { useContext, useEffect } from "react"
import { Can } from "../src/components/Can"
import { AuthContext } from "../src/contexts/AuthContext"
import { useCan } from "../src/hooks/useCan"
import { setupAPIClient } from "../src/services/api"
import { api } from "../src/services/apiClient"
import { withSSRAuth } from "../src/utils/withSSRAuth"

export default function Dashboard() {
  const { user } = useContext(AuthContext)


  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
  }, [])

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')


  return {
    props: {}
  }
})