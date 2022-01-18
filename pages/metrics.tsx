import { setupAPIClient } from "../src/services/api"
import { withSSRAuth } from "../src/utils/withSSRAuth"

export default function Metrics() {


  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')

  
  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
})