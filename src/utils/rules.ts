import * as yup from 'yup'

export const priceSchema = yup.object({
    minPrice: yup.string().test({
        name: 'price-not-allowed',
        message: 'Giá không phù hợp',
        test: testPriceMinMax
    }),
    maxPrice: yup.string().test({
        name: 'price-not-allowed',
        message: 'Giá không phù hợp',
        test: testPriceMinMax
    }),
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
    const { maxPrice, minPrice } = this.parent as { minPrice: string; maxPrice: string }
    if (minPrice !== '' && maxPrice !== '') {
        return Number(maxPrice) >= Number(minPrice)
    }
    return minPrice !== '' || maxPrice !== ''
}

export type Schema = yup.InferType<typeof priceSchema>;