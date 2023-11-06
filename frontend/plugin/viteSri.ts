import { load } from 'cheerio'
import { PluginOption } from 'vite'
import { sha512 } from './hash'
import { getSource } from './getSource'
import { generateHeaders } from './generateHeaders'

export const viteSri = (origins: string[]) => {
  return {
    name: 'sri',
    enforce: 'post',
    apply: 'build',

    async transformIndexHtml(html: string, context: any) {
      const bundle = context.bundle
      const $ = load(html)

      $.prototype.asyncForEach = async function (cspType: string) {
        let csp = cspType
        for (let index = 0; index < this.length; index++) {
          const element = this[index]
          const sourceType = cspType.split('-')[0]
          const source = await getSource($, element, bundle, sourceType)
          const hash = `sha512-${sha512(source)}`
          csp += ` '${hash}'`
        }
        return csp + ';'
      }

      // Implement SRI for scripts and stylesheets.
      const scripts = $('script') as any
      const stylesheets = $('style') as any
      let contentSecurityPolicy = `default-src 'none';`
      contentSecurityPolicy += `base-uri 'none';`
      contentSecurityPolicy += `form-action 'none';`
      contentSecurityPolicy += `img-src 'self' https://*;`
      contentSecurityPolicy += `worker-src 'strict-dynamic';`
      contentSecurityPolicy += `manifest-src 'self';`
      contentSecurityPolicy += `frame-src googleads.g.doubleclick.net;`
      contentSecurityPolicy += `connect-src ${origins.join(' ')};`
      contentSecurityPolicy += `font-src ${origins.join(' ')};`
      contentSecurityPolicy += await scripts.asyncForEach(
        `script-src-elem 'strict-dynamic' ${origins.join(' ')}`,
      )
      contentSecurityPolicy += await stylesheets.asyncForEach(`style-src ${origins.join(' ')}`)

      const cspElement = $('meta').filter('[http-equiv=Content-Security-Policy]')[0]
      cspElement.attribs['content'] = contentSecurityPolicy
      generateHeaders(contentSecurityPolicy)

      return $.html()
    },
  } as PluginOption
}
