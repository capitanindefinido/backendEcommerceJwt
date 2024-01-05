const supertest = require('supertest');
const chai = require('chai');

const expect = chai.expect
const requester = supertest('http://localhost:4000')

describe('Testing ecommerce', () => {
  describe('Products Router', () => {
    it('debe obtener todos los productos', async () => {
      const res = await requester.get('/api/products')
        .expect(200);
  
        expect(res.body.status).to.equal('success');
        expect(res.body.payload.docs).to.be.an('array');
        expect(res.body.payload.limit).to.equal(10);
        expect(res.body.payload.totalPages).to.equal(1);
        expect(res.body.payload.page).to.equal(1);
        expect(res.body.payload.pagingCounter).to.equal(1);
        expect(res.body.payload.hasPrevPage).to.be.false;
        expect(res.body.payload.hasNextPage).to.be.false;
        expect(res.body.payload.prevPage).to.be.null;
        expect(res.body.payload.nextPage).to.be.null;
    });
  
    it('debe crear un nuevo producto', async () => {
      const newProduct = {
        title: "polera negra",
        code : "A037",
        price: 3000,
        stock: 10,
        category: "ropa ",
        description: "ropa  común y corriente",
        isActive: true
    };
  
      const res = await requester.post('/api/products')
        .send(newProduct)
        .expect(200);
  
      expect(res.body.status).to.equal('success');
      expect(res.body.payload).to.be.an('object');
    });
  
    it('debe actualizar un poroducto existente', async () => {
      const productId = '65976de97499e33ff3c962a9';
      const updatedProduct = {
        title: 'gorra',
        code: 'A04',
        price: 23000,
        stock: 5,
        category: 'ropa interior',
        thumbnail: 'thumbnasildeprueba',
        description: 'descripción de prueba',
        isActive: true,
      };
      const res = await requester.put(`/api/products/${productId}`)
        .send(updatedProduct)
        .expect(200);
  
      expect(res.body.status).to.equal('success');
    });

  });
  describe('Carts Router', () => {
    it('debe obtener un carro por su id', async () => {
      const cartId = '65975c914af1fd5fe39e9e18'; 
      const res = await requester.get(`/api/carts/${cartId}`)
        .expect(200);
  
      expect(res.body.status).to.equal('success');
      expect(res.body.payload).to.be.an('object');
    });
  
    it('debe agregar un producto a un carro', async () => {
      const cartId = '65975c914af1fd5fe39e9e18'; // Replace with a valid cart ID
      const productId = '658e0ae06f1c055c7a7297ac'; // Replace with a valid product ID
      const quantity = 2;
  
      const res = await requester.put(`/api/carts/${cartId}/products/${productId}`)
        .send({ quantity })
        .expect(200);
  
      expect(res.body.status).to.equal('success');
    });
  
    it('debe eliminar un producto de un carrito', async () => {
      const cartId = '65975c914af1fd5fe39e9e18'; // Replace with a valid cart ID
      const productId = '658e0ae06f1c055c7a7297ac'; // Replace with a valid product ID
  
      const res = await requester.delete(`/api/carts/${cartId}/products/${productId}`)
        .expect(200);
  
      expect(res.body.status).to.equal('success');
    });
  
  });
  describe('Sessions Router', () => {
    it('debe logear un usuario', async () => {
      const credentials = {
        email: 'hola@hola.cl',
        password: 'hola',
      };
  
      const res = await requester.post('/api/sessions/login')
        .send(credentials)
        .expect(200);
  
      expect(res.body.status).to.equal('success');
      expect(res.body.token).to.exist;
    });
  
    it('debe registrar un nuevo usuario', async () => {
      const newUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'newuser@example.com',
        password: 'newpassword123',
      };
  
      const res = await requester.post('/api/sessions/register')
        .send(newUser)
        .expect(200);
  
      expect(res.body.status).to.equal('Unauthorized');
    });
  
    it('debe eliminar a un usuario', async () => {
      const uid = '65975fbf1fb52d601868c503'
      const res = await requester.delete(`/api/sessions/user/${uid}`)
        .expect(200);
  
        expect(res.body.status).to.equal('usuario eliminado con exito');
    });
  
    // Add more tests as needed
  });

})


