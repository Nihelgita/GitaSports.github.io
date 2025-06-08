document.addEventListener('alpine:init', () => {
  Alpine.data('products', () => ({
    items: [
      { id: 1, name: 'Ban Character', img: '06.jpg', price: 88000, description: 'Ban renang dengan desain karakter yang menarik.' },
      { id: 2, name: 'Baju Renang Polos', img: '07.jpg', price: 138000, description: 'Baju renang polos dengan bahan nyaman.' },
      { id: 3, name: 'Ban Ring', img: '01.jpg', price: 68000, description: 'Ban ring sederhana untuk keamanan berenang.' },
      { id: 4, name: 'Ban Tangan', img: '02.jpg', price: 57000, description: 'Ban tangan untuk anak-anak dan dewasa.' },
      { id: 5, name: 'Rompi Pelampung', img: '03.jpg', price: 89000, description: 'Rompi pelampung untuk keamanan maksimal.' },
      { id: 6, name: 'Kacamata Renang', img: '04.jpg', price: 69000, description: 'Kacamata renang anti-kabut berkualitas tinggi.' },
      { id: 7, name: 'Baju Renang Muslimah', img: '08.jpg', price: 220000, description: 'Baju renang muslimah dengan desain sopan dan nyaman.' },
      { id: 8, name: 'Baju Renang Anak Character', img: '09.jpg', price: 150000, description: 'Baju renang anak dengan karakter favorit.' },
      { id: 9, name: 'Baby Float', img: '05.jpg', price: 75000, description: 'Pelampung bayi untuk keamanan di air.' },
    ].filter(item => item.img && item.img.trim() !== ''),

    init() {
      console.log('Products initialized:', this.items);
      feather.replace();
    },

    addToCart(item) {
      Alpine.store('cart').add(item);
    },
  }));

  Alpine.store('cart', {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    total: 0,
    quantity: 0,

    init() {
      this.updateTotal();
    },

    add(item) {
      const cartItem = this.items.find(cartItem => cartItem.id === item.id);
      if (cartItem) {
        cartItem.quantity++;
      } else {
        this.items.push({ ...item, quantity: 1 });
      }
      this.updateTotal();
    },

    remove(id) {
      const cartItem = this.items.find(item => item.id === id);
      if (cartItem) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateTotal();
      }
    },

    updateTotal() {
      this.quantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
      this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    },

    clearCart() {
      this.items = [];
      this.quantity = 0;
      this.total = 0;
      localStorage.removeItem('cartItems');
    },

    checkout() {
      const form = document.querySelector('#checkoutForm');
      if (!form) {
        alert('Form checkout tidak ditemukan!');
        return;
      }

      const customer = {
        name: form.querySelector('#name')?.value,
        email: form.querySelector('#email')?.value,
        phone: form.querySelector('#phone')?.value,
        address: form.querySelector('#address')?.value,
      };

      if (!customer.name || !customer.email || !customer.phone || !customer.address) {
        alert('Harap isi semua field pada form checkout!');
        return;
      }

      const checkout = Alpine.store('checkout');
      checkout.setCustomer(customer);
      checkout.setCart(this.items, this.total);
      checkout.show();

      document.querySelector('.shopping-cart')?.classList.remove('active');
    },
  });

  Alpine.store('modal', {
    item: null,

    show(item) {
      this.item = item;
      const modal = document.querySelector('#item-detail-modal');
      if (modal) {
        modal.style.display = 'flex';
        feather.replace();
      }
    },

    hide() {
      const modal = document.querySelector('#item-detail-modal');
      if (modal) {
        modal.style.display = 'none';
        this.item = null;
      }
    },
  });

  Alpine.store('checkout', {
    isVisible: false,
    customer: { name: '', email: '', phone: '', address: '' },
    items: [],
    total: 0,

    setCustomer(customer) {
      this.customer = customer;
    },

    setCart(items, total) {
      this.items = items;
      this.total = total;
    },

    show() {
      this.isVisible = true;
      const checkoutPage = document.querySelector('.checkout-page');
      if (checkoutPage) {
        checkoutPage.style.display = 'flex';
        feather.replace();
      }
    },

    hide() {
      this.isVisible = false;
      const checkoutPage = document.querySelector('.checkout-page');
      if (checkoutPage) checkoutPage.style.display = 'none';
    },

    pay() {
      if (!this.customer.name || !this.customer.email || !this.customer.phone || !this.customer.address) {
        alert('Harap isi semua field pada form checkout!');
        return;
      }

      if (!this.items.length) {
        alert('Keranjang belanja kosong!');
        return;
      }

      const orderDetails = [
        `Pesanan Baru:`,
        `Nama: ${this.customer.name}`,
        `Email: ${this.customer.email}`,
        `Telepon: ${this.customer.phone}`,
        `Alamat: ${this.customer.address}`,
        `Total: ${rupiah(this.total)}`,
        `Item:`,
        ...this.items.map(item => `- ${item.name} x${item.quantity} @ ${rupiah(item.price)}`),
      ].join('\n');

      const whatsappNumber = '6288806378277'; // Ganti dengan nomor WhatsApp Anda
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderDetails)}`;
      window.location.href = whatsappUrl;
      alert('Pesanan telah dikirim ke WhatsApp!');

      Alpine.store('cart').clearCart();
      this.hide();
      this.customer = { name: '', email: '', phone: '', address: '' };
      this.items = [];
      this.total = 0;
    },
  });

  Alpine.data('contactForm', () => ({
    name: '',
    email: '',
    message: '',

    async submit() {
      if (!this.name || !this.email || !this.message) {
        alert('Harap isi semua field pada form kontak!');
        return;
      }

      try {
        await axios.post('http://localhost:3000/contact', {
          name: this.name,
          email: this.email,
          message: this.message,
        });
        alert('Pesan telah dikirim!');
        this.name = '';
        this.email = '';
        this.message = '';
      } catch (error) {
        console.error('Error sending contact form:', error);
        alert('Gagal mengirim pesan. Silakan coba lagi.');
      }
    },
  }));
});

const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};