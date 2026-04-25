import Product from "../models/product.js"
import Cart from "../models/Cart.js";
export const updateStock = async (items,createOrder) => {
    if(createOrder){
        for (const product of items) {
            await Product.findByIdAndUpdate(product.productId,
                {
                    $inc: {
                        soldItems: product.quantity
                },
            }
        )
    }

} else{
    for (const product of items) {
        await Product.findByIdAndUpdate(product.productId,
            {
                $inc: {
                    soldItems: -product.quantity
                },
            }
        )
    }
}
}


export const clearCart = async (userId) => {
    await Cart.findOneAndUpdate(
        { user: userId },
        { 
            $set: { 
                items: [] 
            } 
        }
    );
};