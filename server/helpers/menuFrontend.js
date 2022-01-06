
const getMenuFront=(role)=>{

    if(role==="ADMIN"){
        return  [
            {
        
              titulo: 'Dashboard',
              icono: 'mdi mdi-gauge',
              submenu: [
                { titulo: 'Menu principal', url: '/' },
                // { titulo: 'Graficas', url: '/dashboard/graficas' },
              ]
            },
            {
        
              titulo: 'Articulos',
              icono: 'mdi mdi-cards',
              submenu: [
                { titulo: 'Todos los articulos', url: '/dashboard/articulos' },
                { titulo: 'Agregar articulo', url: '/dashboard/articulo/nuevo' },
             
              ]
            },
            {
        
              titulo: 'Provedores',
              icono: 'mdi mdi-book-open',
              submenu: [
                { titulo: 'Todos los provedores', url: '/dashboard/provedores'},
                { titulo: 'Agregar provedor', url: '/dashboard/provedor/nuevo'},
        
              ]
            },
            {
        
              titulo: 'Proyectos',
              icono: 'mdi mdi-briefcase',
              submenu: [
                { titulo: 'Todos los proyectos', url: '/dashboard/proyectos' },
                { titulo: 'Registrar proyecto', url: '/dashboard/proyecto/nuevo' },
          
              ]
            },
            {
        
              titulo: 'Mantenimientos',
              icono: 'mdi mdi-folder-lock-open',
              submenu: [
                { titulo: 'Usuarios', url: '/dashboard/usuarios' },
                { titulo: 'Categorias', url: '/dashboard/categorias' },
              ]
            },
            {
        
              titulo: 'Almacen',
              icono: 'mdi mdi-archive',
              submenu: [
                { titulo: 'Entradas', url: '/dashboard/entradas/vacio' },
                { titulo: 'Salidas', url: '/dashboard/salidas/vacio' },
             
              ]
            }
          ] 
    }else if(role==="USER"){
        return  [
            {
        
              titulo: 'Dashboard',
              icono: 'mdi mdi-gauge',
              submenu: [
                { titulo: 'Menu principal', url: '/' },
                // { titulo: 'Graficas', url: '/dashboard/graficas' },
              ]
            },
            {
        
              titulo: 'Articulos',
              icono: 'mdi mdi-cards',
              submenu: [
                { titulo: 'Todos los articulos', url: '/dashboard/articulos' },
             
              ]
            }, 
           
          ] 
    }
    return;
    
}

module.exports={
    getMenuFront
}