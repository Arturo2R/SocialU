 export default async function handler(req, res) {
    // Check for secret to confirm this is a valid request
    const {secret, id, author} = req.query
    if (secret !== "calandriel") {
      return res.status(401).json({ message: 'Invalid token' })
    }
   
    try {
      // this should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"
      await res.revalidate(`/${author}/${id}`)
      console.log("reavalidating    :", id)
      return res.json({ revalidated: true })
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send('Error revalidating')
    }
  }