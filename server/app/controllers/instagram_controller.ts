// app/Controllers/Http/InstagramController.ts
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class InstagramController {
  /**
   * GET /instagram/latest
   * Renvoie les 5 derniers posts publics d’un compte Instagram.
   */
  public async latest({ response }: HttpContext) {
    const username = 'hypefamousclub'
    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`

    try {
      /* ------------------------------------------------------------------
       * 1. Appel “hidden API” d’Instagram (JSON)
       * ----------------------------------------------------------------- */
      const { data } = await axios.get(url, {
        // Un UA mobile “Instagram” évite le redirect en HTML
        headers: {
          'User-Agent': 'Instagram 273.0.0.9.100 (iPhone; iOS 14_0; Scale/2.00)',
          'Accept': 'application/json',
        },
        timeout: 8000,
      })

      /* ------------------------------------------------------------------
       * 2. On remonte aux médias récents
       * ----------------------------------------------------------------- */
      const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges ?? []

      const posts = edges.slice(0, 10).map((e: any) => {
        const n = e.node
        return {
          id: n.id,
          permalink: `https://www.instagram.com/p/${n.shortcode}/`,
          media_url: n.display_url,
          thumbnail: n.thumbnail_src,
          caption: n.edge_media_to_caption?.edges?.[0]?.node?.text ?? '',
          is_video: n.is_video,
          video_url: n.video_url || '',
        }
      })

      return response.ok(posts)
    } catch (err) {
      console.error('Instagram scrape failed:', err.message)
      return response.status(502).send({ error: 'Scrape failed' })
    }
  }
}
