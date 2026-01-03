export default function Success(){
const id = Math.random().toString(36).slice(2,10).toUpperCase()
return (
<div className="mx-auto max-w-xl px-4 py-20 text-center">
<h1 className="text-3xl font-semibold">Order Confirmed</h1>
<p className="mt-2 text-black/70">Your order number is <span className="font-mono">{id}</span>.</p>
</div>
)
}