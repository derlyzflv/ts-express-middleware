import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}
let productos: Producto[] = [
  { id: 1, nombre: "Laptop", precio: 2500, stock: 10, activo: true },
  { id: 2, nombre: "Mouse", precio: 50, stock: 25, activo: true },
  { id: 3, nombre: "Teclado", precio: 120, stock: 15, activo: true },
  { id: 4, nombre: "Monitor", precio: 800, stock: 8, activo: true },
  { id: 5, nombre: "Audífonos", precio: 150, stock: 20, activo: true },
  { id: 6, nombre: "Impresora", precio: 450, stock: 5, activo: false },
  { id: 7, nombre: "Webcam", precio: 200, stock: 12, activo: true },
  { id: 8, nombre: "Parlante", precio: 180, stock: 0, activo: false },
  { id: 9, nombre: "Memoria USB", precio: 35, stock: 30, activo: true },
  { id: 10, nombre: "Disco duro", precio: 300, stock: 7, activo: true }
];
let idNext = 11;
/* 
import { Request, Response, NextFunction } from 'express';
export interface Producto { id: number; 
nombre: string; precio: number; stock: number; activo: boolean; } export const validarProducto = (req: 
Request, res: Response, next: NextFunction): void => { const { nombre, precio, stock } = req.body; if 
(!nombre || typeof nombre !== 'string' || nombre.trim() === '') { res.status(400).json({ error: 'El nombre 
es obligatorio y debe ser texto.' }); return; } if (typeof precio !== 'number' || precio <= 0) { 
res.status(400).json({ error: 'El precio debe ser un número mayor a 0.' }); return; } next(); };
*/



const validarProducto = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    res.status(400).json({
      error: 'El nombre es obligatorio y debe ser texto.'
    });
    return;
  } if (typeof precio !== 'number' || precio <= 0) {
    res.status(400).json({ error: 'El precio debe ser un número mayor a 0.' });
    return;
  }
  next();
};



/* 
import { Request, Response, NextFunction } from 'express'; export const verificarRol = (rolMinimo: 
'MODERADOR' | 'ADMIN') => { return (req: Request, res: Response, next: NextFunction): void => { const rol = 
req.headers['x-rol']; if (!rol || (rolMinimo === 'ADMIN' && rol !== 'ADMIN')) { res.status(403).json({ 
error: 'Acceso denegado. Se requiere rol ADMIN.' }); return; } next(); }; };
*/
/* 
const verificarRol = (rolMinimo: 'MODERADOR' | 'ADMIN') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const rol = req.headers['x-rol'];

    if (
      !rol ||
      (rolMinimo === 'ADMIN' && rol !== 'ADMIN') ||
      (rolMinimo === 'MODERADOR' && rol !== 'MODERADOR' && rol !== 'ADMIN')
    ) {
      res.status(403).json({
        error: `Acceso denegado. Se requiere rol ${rolMinimo}.`
      });
      return;
    }

    next();
  };
}
*/
const verificarRol = (rolMinimo: 'MODERADOR' | 'ADMIN') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const rol = req.headers['x-rol'];
    if (!rol || (rolMinimo === 'ADMIN' && rol !== 'ADMIN')) {
      res.status(403).json({
        error: 'Acceso denegado. Se requiere rol ADMIN.'
      });
      return;
    }
    next();
  };
};

app.get('/api/productos', (req: Request, res: Response) => {
  res.status(200).json(productos)
})
app.get('/api/productos/:id', (req: Request, res: Response) => {
  res.status(200).json(productos[Number(req.params.id)])
})
app.post('/api/productos', validarProducto, (req: Request, res: Response) => {
  res.status(200).json(productos.push({
    id: idNext++, nombre: req.body.nombre, precio: req.body.precio, stock: req.body.precio, activo: true 
  }))
})
// { "nombre": "teclaso", "precio": 120 }
app.put('/api/productos/:id', validarProducto, (req: Request, res: Response) => {
  const indice = Number(req.params.id);
  if (!indice){
    res.status(400).json({ error: '400' });
  }
  productos[indice] = {...productos[indice], ...req.body, id: indice};
  res.status(202).json(productos[indice]);
});
app.delete('/api/productos/soft/:id', verificarRol('MODERADOR'), (req: Request, res: Response) => {
  const indice = productos.findIndex(p => p.id === Number(req.params.id));
  if (indice === -1) {
    res.status(404).json({ error: '404' });
    return;
  }
  const producto = productos[indice];
  if (!producto) {
    res.status(404).json({ error: '404' });
    return;
  }
  producto.activo = false;
  res.status(200).json(producto);
});

app.delete('/api/productos/hard/:id', verificarRol('ADMIN'), (req: Request, res: Response) => {
  verificarRol;
  const indice = productos.findIndex(p => p.id === Number(req.params.id));
  if (indice === -1) {
    res.status(404).json({ error: '404' });
    return;
  }
  const producto = productos[indice];
  if (!producto) {
    res.status(404).json({ error: '404' });
    return;
  }

  productos.splice(indice, 1);
  res.status(200).json(producto);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});