// app/Controllers/Http/InstagramController.ts
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({ max: 1, ttl: 5 * 60 * 1000 }) // 5 min
const IG_APP_ID = '936619743392459'

export default class InstagramController {
  public async latest({ response }: HttpContext) {
    const username = 'hypefamousclub'

    // 1. essaie la mémoire-cache avant d’appeler Instagram
    const cached = cache.get(username)
    if (cached) return response.ok(cached)

    try {
      const { data } = await axios.get(
        `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        {
          headers: {
            'x-ig-app-id': IG_APP_ID,
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8',
            'Accept': '*/*',
          },
          timeout: 8000,
        }
      )

      const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges ?? []

      const posts = edges.slice(0, 5).map((e: any) => {
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

      cache.set(username, posts)
      return response.ok(posts)
    } catch (err: any) {
      // log détaillé pour diagnostiquer “useragent mismatch”, “please wait”, etc.
      console.error('Instagram scrape failed:', err.response?.data || err.message)
      return response.status(502).send({
        error: 'Instagram error',
        details: err.response?.data ?? 'unknown',
      })
    }
  }
}
