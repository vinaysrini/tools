var L=function(){return L=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++){t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},L.apply(this,arguments)};var z=function(r,e){return z=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])},z(r,e)};function K(r,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");z(r,e);function t(){this.constructor=r}r.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(r){return R(void 0,r)}function R(r,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:var t=e;return new Date(t.getTime());case Object:r===void 0&&(r={});break;case Array:r=[];break;default:return e}for(var n in e)!e.hasOwnProperty(n)||!Z(n)||(r[n]=R(r[n],e[n]));return r}function Z(r){return r!=="__proto__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var q=function(){function r(){var e=this;this.reject=function(){},this.resolve=function(){},this.promise=new Promise(function(t,n){e.resolve=t,e.reject=n})}return r.prototype.wrapCallback=function(e){var t=this;return function(n,o){n?t.reject(n):t.resolve(o),typeof e=="function"&&(t.promise.catch(function(){}),e.length===1?e(n):e(n,o))}},r}();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ke(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(D())}function Q(){try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ee(){return typeof self=="object"&&self.self===self}function Be(){var r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Ue(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ve(){return D().indexOf("Electron/")>=0}function Ge(){var r=D();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function We(){return D().indexOf("MSAppHost/")>=0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var te="FirebaseError",re=function(r){K(e,r);function e(t,n,o){var i=r.call(this,n)||this;return i.code=t,i.customData=o,i.name=te,Object.setPrototypeOf(i,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(i,x.prototype.create),i}return e}(Error),x=function(){function r(e,t,n){this.service=e,this.serviceName=t,this.errors=n}return r.prototype.create=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var o=t[0]||{},i=this.service+"/"+e,u=this.errors[e],p=u?ne(u,o):"Error",d=this.serviceName+": "+p+" ("+i+").",a=new re(i,d,o);return a},r}();function ne(r,e){return r.replace(ie,function(t,n){var o=e[n];return o!=null?String(o):"<"+n+"?>"})}var ie=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k(r,e){return Object.prototype.hasOwnProperty.call(r,e)}function oe(r,e){var t=new ae(r,e);return t.subscribe.bind(t)}var ae=function(){function r(e,t){var n=this;this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(function(){e(n)}).catch(function(o){n.error(o)})}return r.prototype.next=function(e){this.forEachObserver(function(t){t.next(e)})},r.prototype.error=function(e){this.forEachObserver(function(t){t.error(e)}),this.close(e)},r.prototype.complete=function(){this.forEachObserver(function(e){e.complete()}),this.close()},r.prototype.subscribe=function(e,t,n){var o=this,i;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");se(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:n},i.next===void 0&&(i.next=j),i.error===void 0&&(i.error=j),i.complete===void 0&&(i.complete=j);var u=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(function(){try{o.finalError?i.error(o.finalError):i.complete()}catch{}}),this.observers.push(i),u},r.prototype.unsubscribeOne=function(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))},r.prototype.forEachObserver=function(e){if(!this.finalized)for(var t=0;t<this.observers.length;t++)this.sendOne(t,e)},r.prototype.sendOne=function(e,t){var n=this;this.task.then(function(){if(n.observers!==void 0&&n.observers[e]!==void 0)try{t(n.observers[e])}catch(o){typeof console<"u"&&console.error&&console.error(o)}})},r.prototype.close=function(e){var t=this;this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(function(){t.observers=void 0,t.onNoObservers=void 0}))},r}();function se(r,e){if(typeof r!="object"||r===null)return!1;for(var t=0,n=e;t<n.length;t++){var o=n[t];if(o in r&&typeof r[o]=="function")return!0}return!1}function j(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(r){return r&&r._delegate?r._delegate:r}var T=function(){return T=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++){t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},T.apply(this,arguments)};function ue(r,e,t,n){function o(i){return i instanceof t?i:new t(function(u){u(i)})}return new(t||(t=Promise))(function(i,u){function p(c){try{a(n.next(c))}catch(h){u(h)}}function d(c){try{a(n.throw(c))}catch(h){u(h)}}function a(c){c.done?i(c.value):o(c.value).then(p,d)}a((n=n.apply(r,e||[])).next())})}function fe(r,e){var t={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},n,o,i,u;return u={next:p(0),throw:p(1),return:p(2)},typeof Symbol=="function"&&(u[Symbol.iterator]=function(){return this}),u;function p(a){return function(c){return d([a,c])}}function d(a){if(n)throw new TypeError("Generator is already executing.");for(;u&&(u=0,a[0]&&(t=0)),t;)try{if(n=1,o&&(i=a[0]&2?o.return:a[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,a[1])).done)return i;switch(o=0,i&&(a=[a[0]&2,i.value]),a[0]){case 0:case 1:i=a;break;case 4:return t.label++,{value:a[1],done:!1};case 5:t.label++,o=a[1],a=[0];continue;case 7:a=t.ops.pop(),t.trys.pop();continue;default:if(i=t.trys,!(i=i.length>0&&i[i.length-1])&&(a[0]===6||a[0]===2)){t=0;continue}if(a[0]===3&&(!i||a[1]>i[0]&&a[1]<i[3])){t.label=a[1];break}if(a[0]===6&&t.label<i[1]){t.label=i[1],i=a;break}if(i&&t.label<i[2]){t.label=i[2],t.ops.push(a);break}i[2]&&t.ops.pop(),t.trys.pop();continue}a=e.call(r,t)}catch(c){a=[6,c],o=0}finally{n=i=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}}function B(r){var e=typeof Symbol=="function"&&Symbol.iterator,t=e&&r[e],n=0;if(t)return t.call(r);if(r&&typeof r.length=="number")return{next:function(){return r&&n>=r.length&&(r=void 0),{value:r&&r[n++],done:!r}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function C(r,e){var t=typeof Symbol=="function"&&r[Symbol.iterator];if(!t)return r;var n=t.call(r),o,i=[],u;try{for(;(e===void 0||e-- >0)&&!(o=n.next()).done;)i.push(o.value)}catch(p){u={error:p}}finally{try{o&&!o.done&&(t=n.return)&&t.call(n)}finally{if(u)throw u.error}}return i}function U(r,e,t){if(t||arguments.length===2)for(var n=0,o=e.length,i;n<o;n++)(i||!(n in e))&&(i||(i=Array.prototype.slice.call(e,0,n)),i[n]=e[n]);return r.concat(i||Array.prototype.slice.call(e))}var H=function(){function r(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}return r.prototype.setInstantiationMode=function(e){return this.instantiationMode=e,this},r.prototype.setMultipleInstances=function(e){return this.multipleInstances=e,this},r.prototype.setServiceProps=function(e){return this.serviceProps=e,this},r.prototype.setInstanceCreatedCallback=function(e){return this.onInstanceCreated=e,this},r}();/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var le=function(){function r(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map}return r.prototype.get=function(e){e===void 0&&(e=_);var t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){var n=new q;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{var o=this.getOrInitializeService({instanceIdentifier:t});o&&n.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise},r.prototype.getImmediate=function(e){var t=T({identifier:_,optional:!1},e),n=t.identifier,o=t.optional,i=this.normalizeInstanceIdentifier(n);if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(u){if(o)return null;throw u}else{if(o)return null;throw Error("Service "+this.name+" is not available")}},r.prototype.getComponent=function(){return this.component},r.prototype.setComponent=function(e){var t,n;if(e.name!==this.name)throw Error("Mismatching Component "+e.name+" for Provider "+this.name+".");if(this.component)throw Error("Component for "+this.name+" has already been provided");if(this.component=e,!!this.shouldAutoInitialize()){if(pe(e))try{this.getOrInitializeService({instanceIdentifier:_})}catch{}try{for(var o=B(this.instancesDeferred.entries()),i=o.next();!i.done;i=o.next()){var u=C(i.value,2),p=u[0],d=u[1],a=this.normalizeInstanceIdentifier(p);try{var c=this.getOrInitializeService({instanceIdentifier:a});d.resolve(c)}catch{}}}catch(h){t={error:h}}finally{try{i&&!i.done&&(n=o.return)&&n.call(o)}finally{if(t)throw t.error}}}},r.prototype.clearInstance=function(e){e===void 0&&(e=_),this.instancesDeferred.delete(e),this.instances.delete(e)},r.prototype.delete=function(){return ue(this,void 0,void 0,function(){var e;return fe(this,function(t){switch(t.label){case 0:return e=Array.from(this.instances.values()),[4,Promise.all(U(U([],C(e.filter(function(n){return"INTERNAL"in n}).map(function(n){return n.INTERNAL.delete()}))),C(e.filter(function(n){return"_delete"in n}).map(function(n){return n._delete()}))))];case 1:return t.sent(),[2]}})})},r.prototype.isComponentSet=function(){return this.component!=null},r.prototype.isInitialized=function(e){return e===void 0&&(e=_),this.instances.has(e)},r.prototype.initialize=function(e){var t,n;e===void 0&&(e={});var o=e.instanceIdentifier,i=o===void 0?_:o,u=e.options,p=u===void 0?{}:u,d=this.normalizeInstanceIdentifier(i);if(this.isInitialized(d))throw Error(this.name+"("+d+") has already been initialized");if(!this.isComponentSet())throw Error("Component "+this.name+" has not been registered yet");var a=this.getOrInitializeService({instanceIdentifier:d,options:p});try{for(var c=B(this.instancesDeferred.entries()),h=c.next();!h.done;h=c.next()){var f=C(h.value,2),s=f[0],y=f[1],g=this.normalizeInstanceIdentifier(s);d===g&&y.resolve(a)}}catch(v){t={error:v}}finally{try{h&&!h.done&&(n=c.return)&&n.call(c)}finally{if(t)throw t.error}}return a},r.prototype.getOrInitializeService=function(e){var t=e.instanceIdentifier,n=e.options,o=n===void 0?{}:n,i=this.instances.get(t);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:ce(t),options:o}),this.instances.set(t,i),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,i)}catch{}return i||null},r.prototype.normalizeInstanceIdentifier=function(e){return this.component?this.component.multipleInstances?e:_:e},r.prototype.shouldAutoInitialize=function(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"},r}();function ce(r){return r===_?void 0:r}function pe(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var he=function(){function r(e){this.name=e,this.providers=new Map}return r.prototype.addComponent=function(e){var t=this.getProvider(e.name);if(t.isComponentSet())throw new Error("Component "+e.name+" has already been registered with "+this.name);t.setComponent(e)},r.prototype.addOrOverwriteComponent=function(e){var t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)},r.prototype.getProvider=function(e){if(this.providers.has(e))return this.providers.get(e);var t=new le(e,this);return this.providers.set(e,t),t},r.prototype.getProviders=function(){return Array.from(this.providers.values())},r}();/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */function E(){for(var r=0,e=0,t=arguments.length;e<t;e++)r+=arguments[e].length;for(var n=Array(r),o=0,e=0;e<t;e++)for(var i=arguments[e],u=0,p=i.length;u<p;u++,o++)n[o]=i[u];return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var S,M=[],l;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(l||(l={}));var G={debug:l.DEBUG,verbose:l.VERBOSE,info:l.INFO,warn:l.WARN,error:l.ERROR,silent:l.SILENT},de=l.INFO,ve=(S={},S[l.DEBUG]="log",S[l.VERBOSE]="log",S[l.INFO]="info",S[l.WARN]="warn",S[l.ERROR]="error",S),me=function(r,e){for(var t=[],n=2;n<arguments.length;n++)t[n-2]=arguments[n];if(!(e<r.logLevel)){var o=new Date().toISOString(),i=ve[e];if(i)console[i].apply(console,E(["["+o+"]  "+r.name+":"],t));else throw new Error("Attempted to log a message with an invalid logType (value: "+e+")")}},ge=function(){function r(e){this.name=e,this._logLevel=de,this._logHandler=me,this._userLogHandler=null,M.push(this)}return Object.defineProperty(r.prototype,"logLevel",{get:function(){return this._logLevel},set:function(e){if(!(e in l))throw new TypeError('Invalid value "'+e+'" assigned to `logLevel`');this._logLevel=e},enumerable:!1,configurable:!0}),r.prototype.setLogLevel=function(e){this._logLevel=typeof e=="string"?G[e]:e},Object.defineProperty(r.prototype,"logHandler",{get:function(){return this._logHandler},set:function(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"userLogHandler",{get:function(){return this._userLogHandler},set:function(e){this._userLogHandler=e},enumerable:!1,configurable:!0}),r.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,E([this,l.DEBUG],e)),this._logHandler.apply(this,E([this,l.DEBUG],e))},r.prototype.log=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,E([this,l.VERBOSE],e)),this._logHandler.apply(this,E([this,l.VERBOSE],e))},r.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,E([this,l.INFO],e)),this._logHandler.apply(this,E([this,l.INFO],e))},r.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,E([this,l.WARN],e)),this._logHandler.apply(this,E([this,l.WARN],e))},r.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._userLogHandler&&this._userLogHandler.apply(this,E([this,l.ERROR],e)),this._logHandler.apply(this,E([this,l.ERROR],e))},r}();function ye(r){M.forEach(function(e){e.setLogLevel(r)})}function be(r,e){for(var t=function(u){var p=null;e&&e.level&&(p=G[e.level]),r===null?u.userLogHandler=null:u.userLogHandler=function(d,a){for(var c=[],h=2;h<arguments.length;h++)c[h-2]=arguments[h];var f=c.map(function(s){if(s==null)return null;if(typeof s=="string")return s;if(typeof s=="number"||typeof s=="boolean")return s.toString();if(s instanceof Error)return s.message;try{return JSON.stringify(s)}catch{return null}}).filter(function(s){return s}).join(" ");a>=(p??d.logLevel)&&r({level:l[a].toLowerCase(),message:f,args:c,type:d.name})}},n=0,o=M;n<o.length;n++){var i=o[n];t(i)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var O,Ee=(O={},O["no-app"]="No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",O["bad-app-name"]="Illegal App name: '{$appName}",O["duplicate-app"]="Firebase App named '{$appName}' already exists",O["app-deleted"]="Firebase App named '{$appName}' already deleted",O["invalid-app-argument"]="firebase.{$appName}() takes either no argument or a Firebase App instance.",O["invalid-log-argument"]="First argument to `onLog` must be null or a function.",O),N=new x("app","Firebase",Ee),W="@firebase/app",we="0.6.19",Ie="@firebase/analytics",Oe="@firebase/auth",_e="@firebase/database",Se="@firebase/functions",Ne="@firebase/installations",Ae="@firebase/messaging",Re="@firebase/performance",Ce="@firebase/remote-config",Pe="@firebase/storage",Le="@firebase/firestore",Fe="firebase-wrapper";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var m,F="[DEFAULT]",De=(m={},m[W]="fire-core",m[Ie]="fire-analytics",m[Oe]="fire-auth",m[_e]="fire-rtdb",m[Se]="fire-fn",m[Ne]="fire-iid",m[Ae]="fire-fcm",m[Re]="fire-perf",m[Ce]="fire-rc",m[Pe]="fire-gcs",m[Le]="fire-fst",m["fire-js"]="fire-js",m[Fe]="fire-js-all",m);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var A=new ge("@firebase/app");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var P=function(){function r(e,t,n){var o=this;this.firebase_=n,this.isDeleted_=!1,this.name_=t.name,this.automaticDataCollectionEnabled_=t.automaticDataCollectionEnabled||!1,this.options_=X(e),this.container=new he(t.name),this._addComponent(new H("app",function(){return o},"PUBLIC")),this.firebase_.INTERNAL.components.forEach(function(i){return o._addComponent(i)})}return Object.defineProperty(r.prototype,"automaticDataCollectionEnabled",{get:function(){return this.checkDestroyed_(),this.automaticDataCollectionEnabled_},set:function(e){this.checkDestroyed_(),this.automaticDataCollectionEnabled_=e},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"name",{get:function(){return this.checkDestroyed_(),this.name_},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"options",{get:function(){return this.checkDestroyed_(),this.options_},enumerable:!1,configurable:!0}),r.prototype.delete=function(){var e=this;return new Promise(function(t){e.checkDestroyed_(),t()}).then(function(){return e.firebase_.INTERNAL.removeApp(e.name_),Promise.all(e.container.getProviders().map(function(t){return t.delete()}))}).then(function(){e.isDeleted_=!0})},r.prototype._getService=function(e,t){return t===void 0&&(t=F),this.checkDestroyed_(),this.container.getProvider(e).getImmediate({identifier:t})},r.prototype._removeServiceInstance=function(e,t){t===void 0&&(t=F),this.container.getProvider(e).clearInstance(t)},r.prototype._addComponent=function(e){try{this.container.addComponent(e)}catch(t){A.debug("Component "+e.name+" failed to register with FirebaseApp "+this.name,t)}},r.prototype._addOrOverwriteComponent=function(e){this.container.addOrOverwriteComponent(e)},r.prototype.toJSON=function(){return{name:this.name,automaticDataCollectionEnabled:this.automaticDataCollectionEnabled,options:this.options}},r.prototype.checkDestroyed_=function(){if(this.isDeleted_)throw N.create("app-deleted",{appName:this.name_})},r}();P.prototype.name&&P.prototype.options||P.prototype.delete||console.log("dc");var je="8.3.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(r){var e={},t=new Map,n={__esModule:!0,initializeApp:u,app:i,registerVersion:a,setLogLevel:ye,onLog:c,apps:null,SDK_VERSION:je,INTERNAL:{registerComponent:d,removeApp:o,components:t,useAsService:h}};n.default=n,Object.defineProperty(n,"apps",{get:p});function o(f){delete e[f]}function i(f){if(f=f||F,!k(e,f))throw N.create("no-app",{appName:f});return e[f]}i.App=r;function u(f,s){if(s===void 0&&(s={}),typeof s!="object"||s===null){var y=s;s={name:y}}var g=s;g.name===void 0&&(g.name=F);var v=g.name;if(typeof v!="string"||!v)throw N.create("bad-app-name",{appName:String(v)});if(k(e,v))throw N.create("duplicate-app",{appName:v});var I=new r(f,g,n);return e[v]=I,I}function p(){return Object.keys(e).map(function(f){return e[f]})}function d(f){var s=f.name;if(t.has(s))return A.debug("There were multiple attempts to register component "+s+"."),f.type==="PUBLIC"?n[s]:null;if(t.set(s,f),f.type==="PUBLIC"){var y=function(b){if(b===void 0&&(b=i()),typeof b[s]!="function")throw N.create("invalid-app-argument",{appName:s});return b[s]()};f.serviceProps!==void 0&&R(y,f.serviceProps),n[s]=y,r.prototype[s]=function(){for(var b=[],w=0;w<arguments.length;w++)b[w]=arguments[w];var J=this._getService.bind(this,s);return J.apply(this,f.multipleInstances?b:[])}}for(var g=0,v=Object.keys(e);g<v.length;g++){var I=v[g];e[I]._addComponent(f)}return f.type==="PUBLIC"?n[s]:null}function a(f,s,y){var g,v=(g=De[f])!==null&&g!==void 0?g:f;y&&(v+="-"+y);var I=v.match(/\s|\//),b=s.match(/\s|\//);if(I||b){var w=['Unable to register library "'+v+'" with version "'+s+'":'];I&&w.push('library name "'+v+'" contains illegal characters (whitespace or "/")'),I&&b&&w.push("and"),b&&w.push('version name "'+s+'" contains illegal characters (whitespace or "/")'),A.warn(w.join(" "));return}d(new H(v+"-version",function(){return{library:v,version:s}},"VERSION"))}function c(f,s){if(f!==null&&typeof f!="function")throw N.create("invalid-log-argument");be(f,s)}function h(f,s){if(s==="serverAuth")return null;var y=s;return y}return n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(){var r=ze(P);r.INTERNAL=L(L({},r.INTERNAL),{createFirebaseNamespace:Y,extendNamespace:e,createSubscribe:oe,ErrorFactory:x,deepExtend:R});function e(t){R(r,t)}return r}var $=Y();/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Te=function(){function r(e){this.container=e}return r.prototype.getPlatformInfoString=function(){var e=this.container.getProviders();return e.map(function(t){if(xe(t)){var n=t.getImmediate();return n.library+"/"+n.version}else return null}).filter(function(t){return t}).join(" ")},r}();function xe(r){var e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function He(r,e){r.INTERNAL.registerComponent(new H("platform-logger",function(t){return new Te(t)},"PRIVATE")),r.registerVersion(W,we,e),r.registerVersion("fire-js","")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */if(ee()&&self.firebase!==void 0){A.warn(`
    Warning: Firebase is already defined in the global scope. Please make sure
    Firebase library is only loaded once.
  `);var V=self.firebase.SDK_VERSION;V&&V.indexOf("LITE")>=0&&A.warn(`
    Warning: You are trying to load Firebase while using Firebase Performance standalone script.
    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.
    `)}var Me=$.initializeApp;$.initializeApp=function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];return Q()&&A.warn(`
      Warning: This is a browser-targeted Firebase bundle but it appears it is being
      run in a Node environment.  If running in a Node environment, make sure you
      are using the bundle specified by the "main" field in package.json.
      
      If you are using Webpack, you can specify "main" as the first item in
      "resolve.mainFields":
      https://webpack.js.org/configuration/resolve/#resolvemainfields
      
      If using Rollup, use the @rollup/plugin-node-resolve plugin and specify "main"
      as the first item in "mainFields", e.g. ['main', 'module'].
      https://github.com/rollup/@rollup/plugin-node-resolve
      `),Me.apply(void 0,r)};var $e=$;He($e);export{H as C,re as F,ge as L,Ye as a,l as b,Ue as c,Ve as d,Ge as e,$e as f,D as g,We as h,ke as i,Be as j};
//# sourceMappingURL=index.esm-CUxJLCqC.js.map
