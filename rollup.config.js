export default {
    entry: './dist/modules/angular-tablita.es5.js',
    dest: './dist/bundles/angular-tablita.umd.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'ng.angularTablita',
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        'rxjs/Observable',
        'rxjs/Observer'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/forms': 'ng.forms',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx'
    },
    onwarn: () => { return }
}