import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      const products = await Product.query().preload('images')
      return response.ok({
        success: true,
        data: products,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erreur lors de la récupération des produits',
        error: error.message,
      })
    }
  }
}
