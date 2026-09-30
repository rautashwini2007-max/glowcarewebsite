const products = [
 {id:1,name:"Vitamin C Brightening Serum",category:"Skin Care",price:699,rating:4.8,emoji:"✨",tag:"Bestseller",desc:"Lightweight brightening serum for a fresh-looking routine.",skin:"All skin types"},
 {id:2,name:"Daily Hydrating Moisturizer",category:"Skin Care",price:499,rating:4.7,emoji:"🧴",tag:"Hydrating",desc:"Comfortable daily moisturizer for soft, hydrated skin.",skin:"Dry / Normal"},
 {id:3,name:"SPF 50 Daily Sunscreen",category:"Sun Care",price:599,rating:4.9,emoji:"☀️",tag:"Popular",desc:"Everyday sun-care essential with a lightweight finish.",skin:"All skin types"},
 {id:4,name:"Gentle Face Cleanser",category:"Skin Care",price:399,rating:4.6,emoji:"🫧",tag:"Gentle",desc:"A simple cleanser for an easy morning and night routine.",skin:"Normal / Combination"},
 {id:5,name:"Hydrating Lip Balm",category:"Body Care",price:199,rating:4.6,emoji:"💄",tag:"New",desc:"Moisturizing lip care for a smooth everyday feel.",skin:"All skin types"},
 {id:6,name:"Aloe Vera Gel",category:"Body Care",price:299,rating:4.7,emoji:"🌿",tag:"Natural",desc:"Cooling gel for a refreshing self-care routine.",skin:"All skin types"},
 {id:7,name:"Repair Hair Mask",category:"Hair Care",price:549,rating:4.8,emoji:"💇",tag:"Care",desc:"Rich hair mask designed for a nourishing hair-care ritual.",skin:"All hair types"},
 {id:8,name:"Rose Eau de Parfum",category:"Fragrance",price:899,rating:4.7,emoji:"🌹",tag:"Premium",desc:"A soft floral fragrance for a polished finishing touch.",skin:"—"}
];

let cart = JSON.parse(localStorage.getItem("glowcareCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("glowcareWishlist") || "[]");

function save(){localStorage.setItem("glowcareCart",JSON.stringify(cart));localStorage.setItem("glowcareWishlist",JSON.stringify(wishlist));updateCartCount()}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.reduce((n,i)=>n+i.qty,0)}

function showPage(page){
 if(page==="home") renderHome();
 if(page==="products") renderProducts();
 if(page==="routine") renderRoutine();
 if(page==="about") renderAbout();
 if(page==="contact") renderContact();
 if(page==="cart") renderCart();
 window.scrollTo({top:0,behavior:"smooth"});
}

function productCard(p){
 const wished=wishlist.includes(p.id);
 return `<article class="product-card">
 <div class="product-image"><span class="badge">${p.tag}</span><button class="wish" onclick="toggleWish(${p.id})">${wished?"♥":"♡"}</button>${p.emoji}</div>
 <div class="product-body"><small>${p.category} • ${p.skin}</small><h3>${p.name}</h3><p>${p.desc}</p>
 <div class="rating">★★★★★ <span>${p.rating}</span></div>
 <div class="product-bottom"><strong>₹${p.price}</strong><button onclick="addToCart(${p.id})">Add to Cart</button></div></div></article>`;
}

function renderHome(){
 document.getElementById("app").innerHTML=`
 <section class="hero"><div>
 <span class="pill">🌸 Everyday beauty • Thoughtful choices</span>
 <h1>Beauty that<br><span>feels like you.</span></h1>
 <p>Discover skincare, haircare and beauty essentials for a simple, feel-good routine.</p>
 <div class="actions"><button class="primary" onclick="showPage('products')">Shop Beauty Products →</button><button class="secondary" onclick="showPage('routine')">Build a Routine</button></div>
 <div class="trust"><span>✨ Quality-focused</span><span>🌿 Thoughtful formulas</span><span>💗 Easy shopping</span></div>
 </div><div class="hero-art"><div class="circle"></div><div class="flower f1">🌷</div><div class="flower f2">🌸</div><div class="bottle">GLOW<br>CARE</div><div class="floating">Customer love<strong>4.8 / 5 ⭐</strong><small>from our demo community</small></div></div></section>
 <section class="section"><div class="section-heading"><div><span class="eyebrow">EXPLORE</span><h2>Shop by category</h2></div><button class="text-btn" onclick="showPage('products')">View all →</button></div>
 <div class="categories">
 ${[["🧴","Skin Care","Serums, cleansers & moisturizers"],["💇","Hair Care","Masks & everyday essentials"],["💄","Body Care","Simple self-care favourites"],["🌹","Fragrance","Floral & fresh scents"]].map(c=>`<button class="category" onclick="filterCategory('${c[1]}')"><span class="icon">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p></button>`).join("")}
 </div></section>
 <section class="section pale"><div class="section-heading"><div><span class="eyebrow">CUSTOMER FAVOURITES</span><h2>Featured products</h2></div><button class="text-btn" onclick="showPage('products')">See all →</button></div><div class="product-grid">${products.slice(0,4).map(productCard).join("")}</div></section>
 <section class="impact"><div><span class="eyebrow">THE GLOWCARE APPROACH</span><h2>Make your routine simple, personal and enjoyable.</h2><p>Explore products by category, compare prices and build a routine that works for your everyday needs. This academic store demo is designed around a clean, user-friendly shopping experience.</p><button class="primary" onclick="showPage('about')">Learn More</button></div><div class="stats"><div><strong>8+</strong><span>demo products</span></div><div><strong>4.8★</strong><span>average rating</span></div><div><strong>24/7</strong><span>online browsing</span></div></div></section>`;
 updateCartCount();
}

function renderProducts(selected="All Products"){
 document.getElementById("app").innerHTML=`<section class="section"><div class="page-title"><span class="eyebrow">OUR COLLECTION</span><h1>Beauty & skincare products</h1><p>Find your next everyday favourite.</p></div>
 <div class="toolbar"><input id="searchBox" placeholder="🔍  Search by product name..." oninput="applyFilters('${selected}')"><select id="sortBox" onchange="applyFilters('${selected}')"><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Highest Rated</option></select></div>
 <div class="filters">${["All Products","Skin Care","Sun Care","Hair Care","Body Care","Fragrance"].map(c=>`<button class="${selected===c?"active":""}" onclick="filterCategory('${c}')">${c}</button>`).join("")}</div>
 <div id="productResults" class="product-grid"></div></section>`;
 applyFilters(selected);
}

function applyFilters(category){
 const q=(document.getElementById("searchBox")?.value||"").toLowerCase();
 const sort=document.getElementById("sortBox")?.value||"featured";
 let list=products.filter(p=>(category==="All Products"||p.category===category)&&p.name.toLowerCase().includes(q));
 if(sort==="low")list.sort((a,b)=>a.price-b.price);
 if(sort==="high")list.sort((a,b)=>b.price-a.price);
 if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
 document.getElementById("productResults").innerHTML=list.length?list.map(productCard).join():`<div class="empty" style="grid-column:1/-1"><div class="big">🌸</div><h2>No products found</h2><p>Try another product name or category.</p></div>`;
}
function filterCategory(c){showPage("products");setTimeout(()=>{renderProducts(c)},20)}

function addToCart(id){
 const p=products.find(x=>x.id===id);const existing=cart.find(x=>x.id===id);
 if(existing)existing.qty++;else cart.push({...p,qty:1});save();
 const old=document.querySelector(".cart-button");if(old){old.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:350})}
}
function changeQty(id,d){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=d;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);save();renderCart()}
function removeCart(id){cart=cart.filter(x=>x.id!==id);save();renderCart()}
function toggleWish(id){if(wishlist.includes(id))wishlist=wishlist.filter(x=>x!==id);else wishlist.push(id);save();renderProducts()}

function renderCart(){
 const total=cart.reduce((s,i)=>s+i.price*i.qty,0);const shipping=total?total>=999?0:49:0;
 document.getElementById("app").innerHTML=`<section class="section"><div class="page-title"><span class="eyebrow">YOUR BAG</span><h1>Shopping cart</h1></div>
 ${!cart.length?`<div class="empty"><div class="big">🛒</div><h2>Your cart is empty</h2><p>Find something beautiful for your routine.</p><button class="primary" onclick="showPage('products')">Start Shopping</button></div>`:
 `<div class="cart-layout"><div class="cart-list">${cart.map(i=>`<div class="cart-item"><div class="cart-icon">${i.emoji}</div><div class="cart-info"><h3>${i.name}</h3><small>${i.category}</small><strong>₹${i.price}</strong></div><div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${i.id},1)">+</button></div><strong>₹${i.price*i.qty}</strong><button class="remove" onclick="removeCart(${i.id})">×</button></div>`).join("")}</div>
 <aside class="summary"><h2>Order Summary</h2><div class="row"><span>Subtotal</span><b>₹${total}</b></div><div class="row"><span>Delivery</span><b>${shipping?"₹"+shipping:"FREE"}</b></div><hr><div class="row total"><span>Total</span><b>₹${total+shipping}</b></div><button class="primary full" onclick="showCheckout()">Proceed to Checkout</button><small>Free delivery above ₹999</small></aside></div>`}`;
 updateCartCount();
}

function showCheckout(){
 if(!cart.length){showPage("products");return}
 document.getElementById("app").innerHTML=`<section class="section"><div class="page-title"><span class="eyebrow">SECURE CHECKOUT</span><h1>Complete your order</h1></div><div class="form-card"><form class="form" onsubmit="placeOrder(event)"><h3>Delivery Details</h3><div class="form-grid"><input required placeholder="Full name"><input required type="email" placeholder="Email address"><input required placeholder="Phone number"><input required placeholder="City"><input required class="wide" placeholder="Delivery address"><input required placeholder="PIN code"></div><h3>Payment</h3><label><input type="radio" name="payment" checked> Cash on Delivery</label><label><input type="radio" name="payment"> UPI / Card (demo)</label><button class="primary" type="submit">Place Order</button></form></div></section>`;
}
function placeOrder(e){e.preventDefault();cart=[];save();document.getElementById("app").innerHTML=`<section class="section"><div class="success"><div class="big">🌸</div><h1>Order placed successfully!</h1><p>Thank you for shopping with GlowCare.</p><button class="primary" onclick="showPage('home')">Back to Home</button></div></section>`}

function renderRoutine(){
 document.getElementById("app").innerHTML=`<section class="section"><div class="page-title"><span class="eyebrow">SELF-CARE GUIDE</span><h1>Build your daily routine</h1><p>A simple example routine for organizing your skincare steps.</p></div><div class="routine">
 <div class="routine-card"><h2>☀️ Morning</h2>${["Gentle Face Cleanser","Vitamin C Brightening Serum","Daily Hydrating Moisturizer","SPF 50 Daily Sunscreen"].map((x,i)=>`<div class="routine-step"><span class="step-number">${i+1}</span><b>${x}</b></div>`).join("")}</div>
 <div class="routine-card"><h2>🌙 Evening</h2>${["Gentle Face Cleanser","Treatment / Serum","Daily Hydrating Moisturizer","Lip Care"].map((x,i)=>`<div class="routine-step"><span class="step-number">${i+1}</span><b>${x}</b></div>`).join("")}</div>
 </div><div class="empty"><p>Tip: Patch-test new cosmetic products when appropriate and follow the product label.</p><button class="primary" onclick="showPage('products')">Shop Routine Products</button></div></section>`;
}
function renderAbout(){
 document.getElementById("app").innerHTML=`<section class="section"><div class="page-title"><span class="eyebrow">ABOUT GLOWCARE</span><h1>Beauty made easy.</h1><p>A clean and friendly shopping experience for everyday beauty and skincare.</p></div><div class="info-grid">
 <div class="info-card"><div class="icon">✨</div><h2>Quality-focused</h2><p>Browse products with clear categories, prices, ratings and descriptions.</p></div>
 <div class="info-card"><div class="icon">🌿</div><h2>Thoughtful choices</h2><p>Organize products by skin or beauty needs to make browsing easier.</p></div>
 <div class="info-card"><div class="icon">💗</div><h2>User friendly</h2><p>Search, filter, wishlist, cart and checkout features are included in this demo.</p></div>
 </div></section>`;
}
function renderContact(){
 document.getElementById("app").innerHTML=`<section class="section"><div class="page-title"><span class="eyebrow">GET IN TOUCH</span><h1>Contact GlowCare</h1><p>Questions about a product or your order?</p></div><div class="form-card"><form class="form" onsubmit="sendMessage(event)"><input required placeholder="Your name"><input required type="email" placeholder="Email address"><textarea required rows="7" placeholder="Your message"></textarea><button class="primary" type="submit">Send Message</button></form></div></section>`;
}
function sendMessage(e){e.preventDefault();document.getElementById("app").innerHTML=`<section class="section"><div class="success"><div class="big">💌</div><h1>Message sent!</h1><p>Thanks for contacting GlowCare. This demo form is working.</p><button class="primary" onclick="showPage('home')">Back Home</button></div></section>`}

updateCartCount();renderHome();