/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "hot/hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "hot/hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "7c91ef616e53f2122825"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.js")(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/arrow.png":
/*!**************************!*\
  !*** ./assets/arrow.png ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAACrCAYAAADhJFWrAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUqSURBVHic7ZxJiB1FGMd/773JOESNjBgzGld00HGLaIyGQSUEjaCIHlwSFwJiFLwognpRAzmJICKIuG8H0bihCUhcSEQk5hCJkk0UlIhDFPW55TlxZp6Hr9up6VdV/fUS8PD9oOl5XTXVv66u7qq+/KE+zq+xrVpYCqwDjq+jsUYNbQwAm4Efgd+Aa6o22KzaAHAPcELy9yXAFTW0WYlhYC/QBjYk+13AnCqNVumpBvAIcFDm+BBwX4V2K0ndAFwYKLsNOKtsw2WlDgdWR8pbwKPJvjBlpdYAR+TUOQdYWabxMlKLgRXKuquRMVaIot3bD7yZnKiV2SaQ3nOPzQaOBN4pKlaEu4E/gCnP9k/geBu49EAJHQv8UFJqK/LmV1Hk9j0FjCDjsN9T3sU/RseBQWAS+KTA+XK5GrniNuV6qo3MjafUJXQIsLMGqTawHsUiQPNKuB84qth1BBkFrsurlGd9NvAhM8deCzjYU3cS/xj9PfP7Z2BRsvcSG+hN4GXgGM/xogPdZTZwGPBe7MQhVgELI+VVuJnI8jl0++YBW5ArylL19qXsBC5CHpCeE/h4HBlPPqrevpS5wJ/AZ9kCX08tBd4INAT19RRAB7gA+M492Oep+BfxJccw/rVUF/9F3oIIh+iZfsp8zSxC1uNa5uIZNzHq+JqpHZPSYlJaTEqLSWkxKS0mpcWktJiUFpPSYlJaTEqLSWkxKS0mpcWktJiUFpPSYlJaTEqLSWkxKS0mpcWktJiUFpPSYlJaTEqLSWkxKS0mpcWktJiUFpPSYlJaTEqLSWkxKS0mpcWktJiUFpPSYlJaTEqLSWkxKS0mpcWktJiUFpPSYlJaTEqLSWkxKS0mpcWktPwvpXzJEnksQFJxIH5RU8l+FNhY4jxqTgfGmBm70/Vsbvn3yIUcEE4EduPPCgoJpVlBXyPZHbUyBGwjHmDkE3IDjLYD8zUn0wz0OcBa4rmKXSTlpBupMx94HcmiqiQ1ALwKnJkjtA/JNNuXIzYCvIbkBZWSagFPI2lvMTpM57ZMJr9jnAc8R+TJD8XyNIDH8CdOurE8HaSHXKYSuVnJb18sz8lIiOR6PD0bkloD3BooS6X+Jhwikw7yWQEpkNfLIPC+RuouJA4zRBO5uv2ROqkYxCN5zkUubnNM6nrgYeJxPe8CJ+UIpUwCTyDjKMTFyAt5m0/qMuAZj6jLWuBJ4EalFMDlwNGEUysbSLjfLuTl/N/TNwq8QHwu3AjcwfRt0dIF7iQeetRCOmRJeuA04FtmRsdltw+YfrdciQzeceTJm/RsE06d9FYPIDlmsfPsARY0gOVIXFjsSl8CfkUCHz8GTnXKfePPfcy/AJYhsa2DSJ5ZbMzujZT1cCiwiXIT8qf489Eq0Q+8RbUJeR0FQiHzaAEvkh9z2MmRagOvoFhY5qVUNpCsVzea0Jf+1kFepu70kuK+0YeB45DppbTUg8DtmWNZKXe6SW+j2xvZaeaM5P83lZFaBTzgOe5KjdM73aTTSp9TJ8tiJCNvSxGpa5Hb5nt0U6n9gROmYo2k/VCdJcj6/UuN1DLgWcIDsplseeumiaRedmmT0kCmth3AV9kTuCwEnqd3sLp8jqwwNXSAjyLl6fQyYyHpSo0gE25sqboVCR0twko8+YoOPUvuVEqzqP8GeTXk3bYsHWQq2x2pM+PjpInMZ28T//wZA64CfioolPJL8v97InWGEo95fcBNyDfZ9kDlLvBQToMaxpA1/73EJ+QVFgipxaS0mJSWfwHpzm/09xyD0AAAAABJRU5ErkJggg==\"\n\n//# sourceURL=webpack:///./assets/arrow.png?");

/***/ }),

/***/ "./assets/arrowInBoard.png":
/*!*********************************!*\
  !*** ./assets/arrowInBoard.png ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAB6CAYAAAA4RpohAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOGSURBVHic7dw7iF1FGMDx326y0ShR8RlMoREtNBFFVAiooCAiCIqP2CiKRazUwkehnYKFlYKIKD4QFCQqKlHQQsTCB2gjFmHBQo0hWJhFTXZds7sWc4Y9nJw597vrrqSYPwzLPfPNzP/MmTPf3OLuhPG5Ep+OEX8G/hlngMmxdP4nqlSUKhWlSkWpUlGqVJQqFaVKRalSUapUlCoVpUpFqVJRqlSUKhWlSkWpUlGqVJQqFaVKRalSUapUlCoVpUpFqVJRqlSUKhWlSkWpUlGqVJQqFaVKRalSUapUlCoVpUpFqVJRqlSUKhWlSkWpUlGqVJQqFaVKrSWPYKEpi1jqKYutmFvXWuhq/N4MmktJKpffcN1aCW3DT/izM2hXrFs3g324dLWFtmK6GaBPaqjMNOVHXBAZLLLQN+N9nDkQs4i/mr8lTmv62fJfpU7CbpwzELOEw43Q4eZziS14B6esVOp4vI2Lg0KCYhdKN3rCuFLr8DJ2DHQOs9Jr32ahuT7EFXgV60uDd5nAc7ij0OEkNjQDHynE5H1qCn8XYs6XlsVHEaknsavQUZZaNPqHhHmr6M5km+3YiM+7A7TZhQdHDPY65kfEZObxzIiYh/BA+0J7pnbiWenxlXgFb+HuoBTcgk3SOipxLX7F9yzP1A14wfDbuAePjSHT5gm8N1Cf1/FN+cLl2G955+0rH+K4Jn6n9FjmpYW+UCg5ZnvTbkrao4bGOYAdE9L0Dm1mS01nh3A2vsB5nbvsa5OZxvX4BSfi9kKbzMxA3VGcim+sLCF/J/30d1XZiE8MJ+Q+oXZC/kyaqVVhSkoLufOS1KERUjP4wPLaLNK3ebaZwPO4uXUt7+htZqXNNO/ibdo7+rnSetxjID+Oknoa93WudaWyEMuz0xbrppmLpGNM8afoQ1KP4uGe622pOUenm3xiyMm2L/ddJm0nX44jda80S31kqfnCgKTHONH0X4q5BgelN3Ok1I14UXl3n2wGnCvUZ440saWTBOkLxTT2dgdocxVeUzjnNHxt9HkpM4uPB+rX4SUp9/VKbcOb0omzxLd4KiiUuR9fDdRvwBu4pCu1VUqYJw803isd/EY9ti5zuBM/DMRswruabzuT0va/G2cNNNov5ayDYwpl/mja/zwQc3rjsXk97pHuonQnS9KbuG+FQpkDuA2PG07Idw1Vlqj/g+OYoUpFOSal/gU4zQOlT+z12gAAAABJRU5ErkJggg==\"\n\n//# sourceURL=webpack:///./assets/arrowInBoard.png?");

/***/ }),

/***/ "./assets/bow.png":
/*!************************!*\
  !*** ./assets/bow.png ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"data:image/png;base64,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\"\n\n//# sourceURL=webpack:///./assets/bow.png?");

/***/ }),

/***/ "./assets/shootingTarget.png":
/*!***********************************!*\
  !*** ./assets/shootingTarget.png ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"data:image/png;base64,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\"\n\n//# sourceURL=webpack:///./assets/shootingTarget.png?");

/***/ }),

/***/ "./node_modules/css-loader/index.js!./src/style.css":
/*!*************************************************!*\
  !*** ./node_modules/css-loader!./src/style.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var escape = __webpack_require__(/*! ../node_modules/css-loader/lib/url/escape.js */ \"./node_modules/css-loader/lib/url/escape.js\");\nexports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \"*{\\n  box-sizing:border-box;\\n  margin: 0;\\n  padding: 0;\\n\\n}\\nhtml{\\n  height:100%;\\n}\\nbody{\\n  height:100%;\\n}\\n\\n.container{\\n  /*background-color: yellow;*/\\n  position: relative;\\n  height: 100%;\\n  width: 100%;\\n  /*display: flex;*/\\n  /*align-items: center;*/\\n}\\n\\n.main_button{\\n  position: absolute;\\n  width: 200px;\\n  height: 50px;\\n}\\n\\n.gameOverText{\\n font-size: 20px;\\n}\\n\\n.shooting-target{\\n  width: 120px;\\n  height:120px;\\n  /*border: 1px solid blue;*/\\n  position: absolute;\\n  background-image: url(\" + escape(__webpack_require__(/*! ./../assets/shootingTarget.png */ \"./assets/shootingTarget.png\")) + \");\\n  background-position: center;\\n  background-repeat: no-repeat;\\n  background-size: 100% 80%;\\n}\\n\\n\\n.bow{\\n  width: 120px;\\n  height:120px;\\n  position: relative;\\n  /*border: 1px solid blue;*/\\n\\n}\\n.bow:before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  z-index: 2;\\n  width: 120px;\\n  height:100px;\\n  top:20px;\\n  background-image: url(\" + escape(__webpack_require__(/*! ./../assets/bow.png */ \"./assets/bow.png\")) + \");\\n  background-position: center;\\n  background-repeat: no-repeat;\\n  background-size: contain;\\n  transform: rotate(-90deg);\\n}\\n\\n.arrow{\\n  width: 20px;\\n  display: block;\\n  /*border: 1px solid red;*/\\n  position: absolute;\\n  background-position: top;\\n  background-repeat: no-repeat;\\n  background-size: contain;\\n}\\n\\n.arrow-basic{\\n  height: 70px;\\n  background-image: url(\" + escape(__webpack_require__(/*! ./../assets/arrow.png */ \"./assets/arrow.png\")) + \");\\n}\\n\\n.arrow-in-board{\\n  height: 50px;\\n  background-image: url(\" + escape(__webpack_require__(/*! ./../assets/arrowInBoard.png */ \"./assets/arrowInBoard.png\")) + \");\\n}\\n\\n.arrow-in-board:before{\\n  height: 50px;\\n  background-image: url(\" + escape(__webpack_require__(/*! ./../assets/arrowInBoard.png */ \"./assets/arrowInBoard.png\")) + \");\\n}\\n\\n.scoreText{\\n  position:absolute;\\n  top:0;\\n  right:0;\\n  width: 100px;\\n}\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./src/style.css?./node_modules/css-loader");

/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\nmodule.exports = function(useSourceMap) {\n\tvar list = [];\n\n\t// return the list of modules as css string\n\tlist.toString = function toString() {\n\t\treturn this.map(function (item) {\n\t\t\tvar content = cssWithMappingToString(item, useSourceMap);\n\t\t\tif(item[2]) {\n\t\t\t\treturn \"@media \" + item[2] + \"{\" + content + \"}\";\n\t\t\t} else {\n\t\t\t\treturn content;\n\t\t\t}\n\t\t}).join(\"\");\n\t};\n\n\t// import a list of modules into the list\n\tlist.i = function(modules, mediaQuery) {\n\t\tif(typeof modules === \"string\")\n\t\t\tmodules = [[null, modules, \"\"]];\n\t\tvar alreadyImportedModules = {};\n\t\tfor(var i = 0; i < this.length; i++) {\n\t\t\tvar id = this[i][0];\n\t\t\tif(typeof id === \"number\")\n\t\t\t\talreadyImportedModules[id] = true;\n\t\t}\n\t\tfor(i = 0; i < modules.length; i++) {\n\t\t\tvar item = modules[i];\n\t\t\t// skip already imported module\n\t\t\t// this implementation is not 100% perfect for weird media query combinations\n\t\t\t//  when a module is imported multiple times with different media queries.\n\t\t\t//  I hope this will never occur (Hey this way we have smaller bundles)\n\t\t\tif(typeof item[0] !== \"number\" || !alreadyImportedModules[item[0]]) {\n\t\t\t\tif(mediaQuery && !item[2]) {\n\t\t\t\t\titem[2] = mediaQuery;\n\t\t\t\t} else if(mediaQuery) {\n\t\t\t\t\titem[2] = \"(\" + item[2] + \") and (\" + mediaQuery + \")\";\n\t\t\t\t}\n\t\t\t\tlist.push(item);\n\t\t\t}\n\t\t}\n\t};\n\treturn list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n\tvar content = item[1] || '';\n\tvar cssMapping = item[3];\n\tif (!cssMapping) {\n\t\treturn content;\n\t}\n\n\tif (useSourceMap && typeof btoa === 'function') {\n\t\tvar sourceMapping = toComment(cssMapping);\n\t\tvar sourceURLs = cssMapping.sources.map(function (source) {\n\t\t\treturn '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'\n\t\t});\n\n\t\treturn [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n\t}\n\n\treturn [content].join('\\n');\n}\n\n// Adapted from convert-source-map (MIT)\nfunction toComment(sourceMap) {\n\t// eslint-disable-next-line no-undef\n\tvar base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n\tvar data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;\n\n\treturn '/*# ' + data + ' */';\n}\n\n\n//# sourceURL=webpack:///./node_modules/css-loader/lib/css-base.js?");

/***/ }),

/***/ "./node_modules/css-loader/lib/url/escape.js":
/*!***************************************************!*\
  !*** ./node_modules/css-loader/lib/url/escape.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function escape(url) {\n    if (typeof url !== 'string') {\n        return url\n    }\n    // If url is already wrapped in quotes, remove them\n    if (/^['\"].*['\"]$/.test(url)) {\n        url = url.slice(1, -1);\n    }\n    // Should url be wrapped?\n    // See https://drafts.csswg.org/css-values-3/#urls\n    if (/[\"'() \\t\\n]/.test(url)) {\n        return '\"' + url.replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') + '\"'\n    }\n\n    return url\n}\n\n\n//# sourceURL=webpack:///./node_modules/css-loader/lib/url/escape.js?");

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\nvar stylesInDom = {};\n\nvar\tmemoize = function (fn) {\n\tvar memo;\n\n\treturn function () {\n\t\tif (typeof memo === \"undefined\") memo = fn.apply(this, arguments);\n\t\treturn memo;\n\t};\n};\n\nvar isOldIE = memoize(function () {\n\t// Test for IE <= 9 as proposed by Browserhacks\n\t// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805\n\t// Tests for existence of standard globals is to allow style-loader\n\t// to operate correctly into non-standard environments\n\t// @see https://github.com/webpack-contrib/style-loader/issues/177\n\treturn window && document && document.all && !window.atob;\n});\n\nvar getTarget = function (target) {\n  return document.querySelector(target);\n};\n\nvar getElement = (function (fn) {\n\tvar memo = {};\n\n\treturn function(target) {\n                // If passing function in options, then use it for resolve \"head\" element.\n                // Useful for Shadow Root style i.e\n                // {\n                //   insertInto: function () { return document.querySelector(\"#foo\").shadowRoot }\n                // }\n                if (typeof target === 'function') {\n                        return target();\n                }\n                if (typeof memo[target] === \"undefined\") {\n\t\t\tvar styleTarget = getTarget.call(this, target);\n\t\t\t// Special case to return head of iframe instead of iframe itself\n\t\t\tif (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n\t\t\t\ttry {\n\t\t\t\t\t// This will throw an exception if access to iframe is blocked\n\t\t\t\t\t// due to cross-origin restrictions\n\t\t\t\t\tstyleTarget = styleTarget.contentDocument.head;\n\t\t\t\t} catch(e) {\n\t\t\t\t\tstyleTarget = null;\n\t\t\t\t}\n\t\t\t}\n\t\t\tmemo[target] = styleTarget;\n\t\t}\n\t\treturn memo[target]\n\t};\n})();\n\nvar singleton = null;\nvar\tsingletonCounter = 0;\nvar\tstylesInsertedAtTop = [];\n\nvar\tfixUrls = __webpack_require__(/*! ./urls */ \"./node_modules/style-loader/lib/urls.js\");\n\nmodule.exports = function(list, options) {\n\tif (typeof DEBUG !== \"undefined\" && DEBUG) {\n\t\tif (typeof document !== \"object\") throw new Error(\"The style-loader cannot be used in a non-browser environment\");\n\t}\n\n\toptions = options || {};\n\n\toptions.attrs = typeof options.attrs === \"object\" ? options.attrs : {};\n\n\t// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\n\t// tags it will allow on a page\n\tif (!options.singleton && typeof options.singleton !== \"boolean\") options.singleton = isOldIE();\n\n\t// By default, add <style> tags to the <head> element\n        if (!options.insertInto) options.insertInto = \"head\";\n\n\t// By default, add <style> tags to the bottom of the target\n\tif (!options.insertAt) options.insertAt = \"bottom\";\n\n\tvar styles = listToStyles(list, options);\n\n\taddStylesToDom(styles, options);\n\n\treturn function update (newList) {\n\t\tvar mayRemove = [];\n\n\t\tfor (var i = 0; i < styles.length; i++) {\n\t\t\tvar item = styles[i];\n\t\t\tvar domStyle = stylesInDom[item.id];\n\n\t\t\tdomStyle.refs--;\n\t\t\tmayRemove.push(domStyle);\n\t\t}\n\n\t\tif(newList) {\n\t\t\tvar newStyles = listToStyles(newList, options);\n\t\t\taddStylesToDom(newStyles, options);\n\t\t}\n\n\t\tfor (var i = 0; i < mayRemove.length; i++) {\n\t\t\tvar domStyle = mayRemove[i];\n\n\t\t\tif(domStyle.refs === 0) {\n\t\t\t\tfor (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();\n\n\t\t\t\tdelete stylesInDom[domStyle.id];\n\t\t\t}\n\t\t}\n\t};\n};\n\nfunction addStylesToDom (styles, options) {\n\tfor (var i = 0; i < styles.length; i++) {\n\t\tvar item = styles[i];\n\t\tvar domStyle = stylesInDom[item.id];\n\n\t\tif(domStyle) {\n\t\t\tdomStyle.refs++;\n\n\t\t\tfor(var j = 0; j < domStyle.parts.length; j++) {\n\t\t\t\tdomStyle.parts[j](item.parts[j]);\n\t\t\t}\n\n\t\t\tfor(; j < item.parts.length; j++) {\n\t\t\t\tdomStyle.parts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\t\t} else {\n\t\t\tvar parts = [];\n\n\t\t\tfor(var j = 0; j < item.parts.length; j++) {\n\t\t\t\tparts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\n\t\t\tstylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};\n\t\t}\n\t}\n}\n\nfunction listToStyles (list, options) {\n\tvar styles = [];\n\tvar newStyles = {};\n\n\tfor (var i = 0; i < list.length; i++) {\n\t\tvar item = list[i];\n\t\tvar id = options.base ? item[0] + options.base : item[0];\n\t\tvar css = item[1];\n\t\tvar media = item[2];\n\t\tvar sourceMap = item[3];\n\t\tvar part = {css: css, media: media, sourceMap: sourceMap};\n\n\t\tif(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});\n\t\telse newStyles[id].parts.push(part);\n\t}\n\n\treturn styles;\n}\n\nfunction insertStyleElement (options, style) {\n\tvar target = getElement(options.insertInto)\n\n\tif (!target) {\n\t\tthrow new Error(\"Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.\");\n\t}\n\n\tvar lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];\n\n\tif (options.insertAt === \"top\") {\n\t\tif (!lastStyleElementInsertedAtTop) {\n\t\t\ttarget.insertBefore(style, target.firstChild);\n\t\t} else if (lastStyleElementInsertedAtTop.nextSibling) {\n\t\t\ttarget.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);\n\t\t} else {\n\t\t\ttarget.appendChild(style);\n\t\t}\n\t\tstylesInsertedAtTop.push(style);\n\t} else if (options.insertAt === \"bottom\") {\n\t\ttarget.appendChild(style);\n\t} else if (typeof options.insertAt === \"object\" && options.insertAt.before) {\n\t\tvar nextSibling = getElement(options.insertInto + \" \" + options.insertAt.before);\n\t\ttarget.insertBefore(style, nextSibling);\n\t} else {\n\t\tthrow new Error(\"[Style Loader]\\n\\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\\n Must be 'top', 'bottom', or Object.\\n (https://github.com/webpack-contrib/style-loader#insertat)\\n\");\n\t}\n}\n\nfunction removeStyleElement (style) {\n\tif (style.parentNode === null) return false;\n\tstyle.parentNode.removeChild(style);\n\n\tvar idx = stylesInsertedAtTop.indexOf(style);\n\tif(idx >= 0) {\n\t\tstylesInsertedAtTop.splice(idx, 1);\n\t}\n}\n\nfunction createStyleElement (options) {\n\tvar style = document.createElement(\"style\");\n\n\toptions.attrs.type = \"text/css\";\n\n\taddAttrs(style, options.attrs);\n\tinsertStyleElement(options, style);\n\n\treturn style;\n}\n\nfunction createLinkElement (options) {\n\tvar link = document.createElement(\"link\");\n\n\toptions.attrs.type = \"text/css\";\n\toptions.attrs.rel = \"stylesheet\";\n\n\taddAttrs(link, options.attrs);\n\tinsertStyleElement(options, link);\n\n\treturn link;\n}\n\nfunction addAttrs (el, attrs) {\n\tObject.keys(attrs).forEach(function (key) {\n\t\tel.setAttribute(key, attrs[key]);\n\t});\n}\n\nfunction addStyle (obj, options) {\n\tvar style, update, remove, result;\n\n\t// If a transform function was defined, run it on the css\n\tif (options.transform && obj.css) {\n\t    result = options.transform(obj.css);\n\n\t    if (result) {\n\t    \t// If transform returns a value, use that instead of the original css.\n\t    \t// This allows running runtime transformations on the css.\n\t    \tobj.css = result;\n\t    } else {\n\t    \t// If the transform function returns a falsy value, don't add this css.\n\t    \t// This allows conditional loading of css\n\t    \treturn function() {\n\t    \t\t// noop\n\t    \t};\n\t    }\n\t}\n\n\tif (options.singleton) {\n\t\tvar styleIndex = singletonCounter++;\n\n\t\tstyle = singleton || (singleton = createStyleElement(options));\n\n\t\tupdate = applyToSingletonTag.bind(null, style, styleIndex, false);\n\t\tremove = applyToSingletonTag.bind(null, style, styleIndex, true);\n\n\t} else if (\n\t\tobj.sourceMap &&\n\t\ttypeof URL === \"function\" &&\n\t\ttypeof URL.createObjectURL === \"function\" &&\n\t\ttypeof URL.revokeObjectURL === \"function\" &&\n\t\ttypeof Blob === \"function\" &&\n\t\ttypeof btoa === \"function\"\n\t) {\n\t\tstyle = createLinkElement(options);\n\t\tupdate = updateLink.bind(null, style, options);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\n\t\t\tif(style.href) URL.revokeObjectURL(style.href);\n\t\t};\n\t} else {\n\t\tstyle = createStyleElement(options);\n\t\tupdate = applyToTag.bind(null, style);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\t\t};\n\t}\n\n\tupdate(obj);\n\n\treturn function updateStyle (newObj) {\n\t\tif (newObj) {\n\t\t\tif (\n\t\t\t\tnewObj.css === obj.css &&\n\t\t\t\tnewObj.media === obj.media &&\n\t\t\t\tnewObj.sourceMap === obj.sourceMap\n\t\t\t) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tupdate(obj = newObj);\n\t\t} else {\n\t\t\tremove();\n\t\t}\n\t};\n}\n\nvar replaceText = (function () {\n\tvar textStore = [];\n\n\treturn function (index, replacement) {\n\t\ttextStore[index] = replacement;\n\n\t\treturn textStore.filter(Boolean).join('\\n');\n\t};\n})();\n\nfunction applyToSingletonTag (style, index, remove, obj) {\n\tvar css = remove ? \"\" : obj.css;\n\n\tif (style.styleSheet) {\n\t\tstyle.styleSheet.cssText = replaceText(index, css);\n\t} else {\n\t\tvar cssNode = document.createTextNode(css);\n\t\tvar childNodes = style.childNodes;\n\n\t\tif (childNodes[index]) style.removeChild(childNodes[index]);\n\n\t\tif (childNodes.length) {\n\t\t\tstyle.insertBefore(cssNode, childNodes[index]);\n\t\t} else {\n\t\t\tstyle.appendChild(cssNode);\n\t\t}\n\t}\n}\n\nfunction applyToTag (style, obj) {\n\tvar css = obj.css;\n\tvar media = obj.media;\n\n\tif(media) {\n\t\tstyle.setAttribute(\"media\", media)\n\t}\n\n\tif(style.styleSheet) {\n\t\tstyle.styleSheet.cssText = css;\n\t} else {\n\t\twhile(style.firstChild) {\n\t\t\tstyle.removeChild(style.firstChild);\n\t\t}\n\n\t\tstyle.appendChild(document.createTextNode(css));\n\t}\n}\n\nfunction updateLink (link, options, obj) {\n\tvar css = obj.css;\n\tvar sourceMap = obj.sourceMap;\n\n\t/*\n\t\tIf convertToAbsoluteUrls isn't defined, but sourcemaps are enabled\n\t\tand there is no publicPath defined then lets turn convertToAbsoluteUrls\n\t\ton by default.  Otherwise default to the convertToAbsoluteUrls option\n\t\tdirectly\n\t*/\n\tvar autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;\n\n\tif (options.convertToAbsoluteUrls || autoFixUrls) {\n\t\tcss = fixUrls(css);\n\t}\n\n\tif (sourceMap) {\n\t\t// http://stackoverflow.com/a/26603875\n\t\tcss += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + \" */\";\n\t}\n\n\tvar blob = new Blob([css], { type: \"text/css\" });\n\n\tvar oldSrc = link.href;\n\n\tlink.href = URL.createObjectURL(blob);\n\n\tif(oldSrc) URL.revokeObjectURL(oldSrc);\n}\n\n\n//# sourceURL=webpack:///./node_modules/style-loader/lib/addStyles.js?");

/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n/**\n * When source maps are enabled, `style-loader` uses a link element with a data-uri to\n * embed the css on the page. This breaks all relative urls because now they are relative to a\n * bundle instead of the current page.\n *\n * One solution is to only use full urls, but that may be impossible.\n *\n * Instead, this function \"fixes\" the relative urls to be absolute according to the current page location.\n *\n * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.\n *\n */\n\nmodule.exports = function (css) {\n  // get current location\n  var location = typeof window !== \"undefined\" && window.location;\n\n  if (!location) {\n    throw new Error(\"fixUrls requires window.location\");\n  }\n\n\t// blank or null?\n\tif (!css || typeof css !== \"string\") {\n\t  return css;\n  }\n\n  var baseUrl = location.protocol + \"//\" + location.host;\n  var currentDir = baseUrl + location.pathname.replace(/\\/[^\\/]*$/, \"/\");\n\n\t// convert each url(...)\n\t/*\n\tThis regular expression is just a way to recursively match brackets within\n\ta string.\n\n\t /url\\s*\\(  = Match on the word \"url\" with any whitespace after it and then a parens\n\t   (  = Start a capturing group\n\t     (?:  = Start a non-capturing group\n\t         [^)(]  = Match anything that isn't a parentheses\n\t         |  = OR\n\t         \\(  = Match a start parentheses\n\t             (?:  = Start another non-capturing groups\n\t                 [^)(]+  = Match anything that isn't a parentheses\n\t                 |  = OR\n\t                 \\(  = Match a start parentheses\n\t                     [^)(]*  = Match anything that isn't a parentheses\n\t                 \\)  = Match a end parentheses\n\t             )  = End Group\n              *\\) = Match anything and then a close parens\n          )  = Close non-capturing group\n          *  = Match anything\n       )  = Close capturing group\n\t \\)  = Match a close parens\n\n\t /gi  = Get all matches, not the first.  Be case insensitive.\n\t */\n\tvar fixedCss = css.replace(/url\\s*\\(((?:[^)(]|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)/gi, function(fullMatch, origUrl) {\n\t\t// strip quotes (if they exist)\n\t\tvar unquotedOrigUrl = origUrl\n\t\t\t.trim()\n\t\t\t.replace(/^\"(.*)\"$/, function(o, $1){ return $1; })\n\t\t\t.replace(/^'(.*)'$/, function(o, $1){ return $1; });\n\n\t\t// already a full url? no change\n\t\tif (/^(#|data:|http:\\/\\/|https:\\/\\/|file:\\/\\/\\/|\\s*$)/i.test(unquotedOrigUrl)) {\n\t\t  return fullMatch;\n\t\t}\n\n\t\t// convert the url to a full url\n\t\tvar newUrl;\n\n\t\tif (unquotedOrigUrl.indexOf(\"//\") === 0) {\n\t\t  \t//TODO: should we add protocol?\n\t\t\tnewUrl = unquotedOrigUrl;\n\t\t} else if (unquotedOrigUrl.indexOf(\"/\") === 0) {\n\t\t\t// path should be relative to the base url\n\t\t\tnewUrl = baseUrl + unquotedOrigUrl; // already starts with '/'\n\t\t} else {\n\t\t\t// path should be relative to current directory\n\t\t\tnewUrl = currentDir + unquotedOrigUrl.replace(/^\\.\\//, \"\"); // Strip leading './'\n\t\t}\n\n\t\t// send back the fixed url(...)\n\t\treturn \"url(\" + JSON.stringify(newUrl) + \")\";\n\t});\n\n\t// send back the fixed css\n\treturn fixedCss;\n};\n\n\n//# sourceURL=webpack:///./node_modules/style-loader/lib/urls.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! ./style.css */ \"./src/style.css\");\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Bow = function Bow() {\n  _classCallCheck(this, Bow);\n\n  this.top = window.innerHeight - 150;\n  this.left = window.innerWidth / 2 - 60;\n};\n\nvar Arrow = function Arrow(top) {\n  _classCallCheck(this, Arrow);\n\n  this.top = top;\n  this.canArrowBasicDisappear = false;\n  thi.h = 0;\n};\n\nvar Game = function Game(scoreText) {\n  _classCallCheck(this, Game);\n\n  this.scoreText = scoreText;\n  this.noOfArrows = 2;\n  this.stopGame = false;\n};\n\nvar ShootingTarget = function ShootingTarget(left) {\n  _classCallCheck(this, ShootingTarget);\n\n  this.direction = 1;\n  this.left = left;\n};\n\nvar Button = function Button() {\n  _classCallCheck(this, Button);\n\n  this.top = window.innerHeight / 2 - 25;\n  this.left = window.innerWidth / 2 - 100;\n};\n\nvar aroowTopPos = 0;\nvar arrowInBoardLeftPos = 0;\nvar shootingTargetObjLeft = window.innerWidth / 2 - 60;\nvar gameObj = new Game(0);\nvar shootingTargetObj = new ShootingTarget(shootingTargetObjLeft); // console.log(window.innerWidth/2-60);\n\nvar bowObj = new Bow();\nvar arrowObj = new Arrow(aroowTopPos);\nvar arrowInBoardObj = new Arrow();\narrowInBoardObj.left = 0;\nvar buttonObj = new Button();\n\nfunction component() {\n  //main div\n  var gameContainerDOM = document.createElement('div');\n  gameContainerDOM.classList.add('container'); // main button\n\n  var buttonDOM = document.createElement('button');\n  buttonDOM.classList.add('main_button');\n  buttonDOM.innerHTML = 'PLAY A NEW GAME';\n  buttonDOM.setAttribute(\"style\", \"top:\".concat(buttonObj.top, \"px;left:\").concat(buttonObj.left, \"px\"));\n  buttonDOM.addEventListener('click', startPlaying);\n  gameContainerDOM.appendChild(buttonDOM); //score table\n\n  var scoreTextDOM = document.createElement('div');\n  scoreTextDOM.classList.add('scoreText');\n  scoreTextDOM.innerHTML = 'Score: ' + gameObj.scoreText + ' Arrows: ' + gameObj.noOfArrows;\n  gameContainerDOM.appendChild(scoreTextDOM); //shooting target\n\n  var shootingTargetDOM = document.createElement('div');\n  shootingTargetDOM.classList.add('shooting-target');\n  shootingTargetDOM.setAttribute(\"style\", \"top:0px;left:\".concat(window.innerWidth / 2 - 60, \"px\"));\n  gameContainerDOM.appendChild(shootingTargetDOM); //bow\n\n  var bowDOM = document.createElement('div');\n  bowDOM.classList.add('bow');\n  bowDOM.setAttribute(\"style\", \"top:\".concat(bowObj.top, \"px;left:\").concat(bowObj.left, \"px\"));\n  gameContainerDOM.appendChild(bowDOM); //arrow\n\n  var arrowDOM = document.createElement('div');\n  arrowDOM.classList.add('arrow', 'arrow-basic');\n  arrowDOM.setAttribute(\"style\", \"top:\".concat(arrowObj.top, \"px;left:49px\"));\n  bowDOM.appendChild(arrowDOM); //arrow in board\n\n  var arrowInBoardDOM = document.createElement('div');\n  arrowInBoardDOM.classList.add('arrow', 'arrow-in-board');\n  arrowInBoardDOM.setAttribute(\"style\", \"opacity:0;top:55px;left:\".concat(arrowInBoardObj.left, \"px\"));\n  shootingTargetDOM.appendChild(arrowInBoardDOM);\n  return gameContainerDOM;\n}\n\nfunction shoot() {\n  var currentArrowPosition = 0;\n  var id = setInterval(movingArrow, 10);\n\n  function movingArrow() {\n    currentArrowPosition++;\n  }\n}\n\nfunction startPlaying() {\n  //removing button\n  var child = document.getElementsByClassName('main_button');\n  var parent = child[0].parentNode;\n  parent.removeChild(child[0]); //if the gameOverText exist remove it\n\n  var gameOverText = document.getElementsByClassName('gameOverText');\n\n  if (gameOverText.length > 0) {\n    var gameOverTextParent = gameOverText[0].parentNode;\n    gameOverTextParent.removeChild(gameOverText[0]);\n  }\n\n  ;\n  backInitSettings();\n  initiateMovingTarget();\n  addEventListenerToDoc(true);\n}\n\nfunction backInitSettings() {\n  gameObj.scoreText = 0;\n  gameObj.stopGame = false;\n  gameObj.noOfArrows = 2;\n  var scoreTextDOM = document.getElementsByClassName('scoreText');\n  scoreTextDOM[0].innerHTML = 'Score: ' + gameObj.scoreText + ' Arrows: ' + gameObj.noOfArrows;\n  setInitialArrows();\n}\n\nfunction gameOver() {\n  gameObj.stopGame = true;\n  showGameOverInfo();\n}\n\nfunction showGameOverInfo() {\n  //creating game over info and adding it to the main el\n  var element = document.getElementsByClassName('container');\n  var gameOverText = document.createElement('p'); // gameOverText.setAttribute(\"style\",`top:${window.innerHeight/2-120}px;left:${window.innerWidth/2-100}px`);\n\n  gameOverText.classList.add('gameOverText');\n  gameOverText.innerText = \"Game over. Your score is \".concat(gameObj.scoreText);\n  element[0].appendChild(gameOverText);\n  var buttonDOM = document.createElement('button');\n  buttonDOM.classList.add('main_button');\n  buttonDOM.innerHTML = 'PLAY A NEW GAME';\n  buttonDOM.setAttribute(\"style\", \"top:\".concat(buttonObj.top, \"px;left:\").concat(buttonObj.left, \"px\"));\n  buttonDOM.addEventListener('click', startPlaying);\n  element[0].appendChild(buttonDOM); // gameObj.stopGame=false;\n}\n\nfunction setInitialArrows() {\n  var target = document.getElementsByClassName('shooting-target');\n  target[0].childNodes[0].setAttribute(\"style\", \"opacity:0;top:55px;left:\".concat(arrowInBoardObj.left, \"px\"));\n  arrowObj.top = aroowTopPos;\n  var arrowDOM = document.getElementsByClassName('arrow-basic');\n  arrowDOM[0].setAttribute(\"style\", \"opacity:1;top:\".concat(arrowObj.top, \"px;left:49px\"));\n  addEventListenerToDoc(true);\n}\n\nfunction initiateMovingTarget() {\n  var id = setInterval(movingTarget, 10);\n\n  function movingTarget() {\n    gameObj.stopGame == true ? clearInterval(id) : null;\n    var target = document.getElementsByClassName('shooting-target');\n    target[0].setAttribute(\"style\", \"top:0px;left:\".concat(shootingTargetObj.left, \"px\"));\n    var marginForBoardLeft = window.innerWidth < 550 ? 0 : window.innerWidth / 2 - 240;\n    var marginForBoardRight = window.innerWidth < 550 ? window.innerWidth - 120 : window.innerWidth / 2 + 120;\n\n    if (shootingTargetObj.left >= marginForBoardRight || shootingTargetObj.left <= marginForBoardLeft) {\n      shootingTargetObj.direction = shootingTargetObj.direction * -1;\n\n      if (arrowObj.canArrowBasicDisappear) {\n        setInitialArrows();\n      }\n    }\n\n    shootingTargetObj.left = shootingTargetObj.left + shootingTargetObj.direction;\n  }\n}\n\nfunction addEventListenerToDoc(val) {\n  if (val) {\n    // arrowObj.canArrowBasicDisappear=true;\n    setTimeout(function () {\n      ['click', 'keypress'].forEach(function (evt) {\n        return document.body.addEventListener(evt, moveArrow);\n      });\n    }, 10);\n  } else {\n    ['click', 'keypress'].forEach(function (evt) {\n      return document.body.removeEventListener(evt, moveArrow);\n    });\n  }\n}\n\nfunction moveArrow(e) {\n  addEventListenerToDoc(false);\n  var opacityArrowBasic = 1;\n  var arrowDOM = document.getElementsByClassName('arrow-basic');\n  arrowObj.canArrowBasicDisappear = false; // if(!arrowObj.canArrowBasicDisappear) return null;\n\n  if (e.type === \"click\" || e.charCode === 32 || e.charCode === 102) {\n    var movingArrowFn = function movingArrowFn() {\n      if (arrowDOM[0].offsetParent.offsetTop + arrowObj.top == 55) {\n        if (window.innerWidth / 2 - 120 < shootingTargetObj.left && shootingTargetObj.left < window.innerWidth / 2) {\n          gameObj.noOfArrows == 0 ? gameOver() : null;\n          opacityArrowBasic = 0;\n          clearInterval(id);\n          arrowObj.canArrowBasicDisappear = true;\n          updateData(arrowDOM);\n        }\n      } else if (arrowDOM[0].offsetParent.offsetTop + arrowObj.top < -70) {\n        gameObj.noOfArrows == 0 ? gameOver() : null;\n        clearInterval(id);\n        arrowObj.canArrowBasicDisappear = true;\n      }\n\n      arrowDOM[0].setAttribute(\"style\", \"opacity:\".concat(opacityArrowBasic, \";top:\").concat(arrowObj.top, \"px;left:49px\"));\n      arrowObj.top = arrowObj.top - 1;\n      var scoreTextDOM = document.getElementsByClassName('scoreText');\n      scoreTextDOM[0].innerHTML = 'Score: ' + gameObj.scoreText + ' Arrows: ' + gameObj.noOfArrows;\n    };\n\n    gameObj.noOfArrows = gameObj.noOfArrows - 1;\n    var id = setInterval(movingArrowFn, 4);\n  } else {\n    return null;\n  }\n}\n\nfunction updateData(arrowDOM) {\n  var arrowLeftPos = arrowDOM[0].offsetParent.offsetLeft + 49;\n  var placeOnShootingTarget = -1 * (shootingTargetObj.left - arrowLeftPos);\n  arrowInBoardObj.left = placeOnShootingTarget;\n  var arr = [97.5, 81.5, 70.5, 57.5, 41.5, 28.5, 17, 1, -10];\n  var minusPointOnBoard = 0;\n  var breakLoop = false;\n  arr.forEach(function (item, i) {\n    if (breakLoop) return;\n\n    if (placeOnShootingTarget >= item) {\n      breakLoop = true;\n      i > 4 ? minusPointOnBoard = i - 4 : null;\n      gameObj.scoreText = gameObj.scoreText + 2 + 2 * i - 4 * minusPointOnBoard;\n      console.log(\"points:\", 2 + 2 * i - 4 * minusPointOnBoard);\n    }\n  });\n  var scoreTextDOM = document.getElementsByClassName('scoreText');\n  scoreTextDOM[0].innerHTML = 'Score: ' + gameObj.scoreText + ' Arrows: ' + gameObj.noOfArrows;\n  var arrowInBoardDOM = document.getElementsByClassName('arrow-in-board');\n  arrowInBoardDOM[0].setAttribute(\"style\", \"opacity:1;top:55px;left:\".concat(arrowInBoardObj.left, \"px\"));\n}\n\ndocument.body.appendChild(component());\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../node_modules/css-loader!./style.css */ \"./node_modules/css-loader/index.js!./src/style.css\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../node_modules/css-loader!./style.css */ \"./node_modules/css-loader/index.js!./src/style.css\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function() {\n\t\tvar newContent = __webpack_require__(/*! !../node_modules/css-loader!./style.css */ \"./node_modules/css-loader/index.js!./src/style.css\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t})(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./src/style.css?");

/***/ })

/******/ });