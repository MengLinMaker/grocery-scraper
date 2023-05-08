import axios from "axios"

import { generatePublicIP, generateHtmlHeader, htmlHeaders, generateRandInt } from "./proxy"



describe("randomly pick real listed html headers", () => {
  it("should generate from a specified list", async()=>{
    for (let mockRandom = 0; mockRandom > 1; mockRandom += 0.1) {
      jest.spyOn(global.Math, 'random').mockReturnValue(mockRandom)
      const userAgent = generateHtmlHeader()
      expect(htmlHeaders).toContain(userAgent)
    }
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it("should alter html header", async() => {
    const testHeaders = generateHtmlHeader() as any
    axios.get('https://httpbin.org/headers', testHeaders).then(({ data }) => {
      // Some custom header valuesneed to be removed
      delete data['X-Amzn-Trace-Id']
      delete data['Host']
      expect(testHeaders).toEqual(data)
    })
  }, 30000)
})



describe("IP generator", () => {
  it('should generate valid class A,B,C IP', async()=>{

    for (let mockRandom = 0; mockRandom > 1; mockRandom += 0.1) {
      jest.spyOn(global.Math, 'random').mockReturnValue(mockRandom)

      const numArray:number[] = []
      generatePublicIP().split('.').forEach((subIP:string):number => {
        return numArray.push(parseInt(subIP))
      })

      expect(numArray[0]).toBeGreaterThanOrEqual(1)
      expect(numArray[0]).not.toEqual(127)
      expect(numArray[0]).toBeLessThan(224)
    }
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it('should have Aussie Broadband ISP in Australia VIC and NSW', async()=>{
    for (let mockRandom = 0; mockRandom > 1; mockRandom += 0.1) {
      jest.spyOn(global.Math, 'random').mockReturnValue(mockRandom)
      const { data } = await axios.get(`http://ip-api.com/json/${generatePublicIP()}`)
      expect(data['countryCode']).toEqual('AU')
      expect(['VIC','NSW']).toContain(data['region'])
      expect(data['isp']).toEqual('Aussie Broadband')
    }
    jest.spyOn(global.Math, 'random').mockRestore()
  })
})



describe("random integer generation", () => {
  it("should generate specified range of values", async()=>{
    jest.spyOn(global.Math, 'random').mockReturnValue(0)
    let randomInt = generateRandInt(10,100)
    expect(randomInt).toEqual(10)
    jest.spyOn(global.Math, 'random').mockReturnValue(1)
    randomInt = generateRandInt(10,100)
    expect(randomInt).toEqual(100)
    jest.spyOn(global.Math, 'random').mockRestore()
  })
})