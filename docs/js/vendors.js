(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

	/*!
	 * EasePack 3.5.1
	 * https://greensock.com
	 *
	 * @license Copyright 2008-2020, GreenSock. All rights reserved.
	 * Subject to the terms at https://greensock.com/standard-license or for
	 * Club GreenSock members, the agreement issued with that membership.
	 * @author: Jack Doyle, jack@greensock.com
	*/
	var gsap,
	    _registerEase,
	    _getGSAP = function _getGSAP() {
	  return gsap || typeof window !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap;
	},
	    _boolean = function _boolean(value, defaultValue) {
	  return !!(typeof value === "undefined" ? defaultValue : value && !~(value + "").indexOf("false"));
	},
	    _initCore = function _initCore(core) {
	  gsap = core || _getGSAP();

	  if (gsap) {
	    _registerEase = gsap.registerEase;

	    var eases = gsap.parseEase(),
	        createConfig = function createConfig(ease) {
	      return function (ratio) {
	        var y = 0.5 + ratio / 2;

	        ease.config = function (p) {
	          return ease(2 * (1 - p) * p * y + p * p);
	        };
	      };
	    },
	        p;

	    for (p in eases) {
	      if (!eases[p].config) {
	        createConfig(eases[p]);
	      }
	    }

	    _registerEase("slow", SlowMo);

	    _registerEase("expoScale", ExpoScaleEase);

	    _registerEase("rough", RoughEase);

	    for (p in EasePack) {
	      p !== "version" && gsap.core.globals(p, EasePack[p]);
	    }
	  }
	},
	    _createSlowMo = function _createSlowMo(linearRatio, power, yoyoMode) {
	  linearRatio = Math.min(1, linearRatio || 0.7);

	  var pow = linearRatio < 1 ? power || power === 0 ? power : 0.7 : 0,
	      p1 = (1 - linearRatio) / 2,
	      p3 = p1 + linearRatio,
	      calcEnd = _boolean(yoyoMode);

	  return function (p) {
	    var r = p + (0.5 - p) * pow;
	    return p < p1 ? calcEnd ? 1 - (p = 1 - p / p1) * p : r - (p = 1 - p / p1) * p * p * p * r : p > p3 ? calcEnd ? p === 1 ? 0 : 1 - (p = (p - p3) / p1) * p : r + (p - r) * (p = (p - p3) / p1) * p * p * p : calcEnd ? 1 : r;
	  };
	},
	    _createExpoScale = function _createExpoScale(start, end, ease) {
	  var p1 = Math.log(end / start),
	      p2 = end - start;
	  ease && (ease = gsap.parseEase(ease));
	  return function (p) {
	    return (start * Math.exp(p1 * (ease ? ease(p) : p)) - start) / p2;
	  };
	},
	    EasePoint = function EasePoint(time, value, next) {
	  this.t = time;
	  this.v = value;

	  if (next) {
	    this.next = next;
	    next.prev = this;
	    this.c = next.v - value;
	    this.gap = next.t - time;
	  }
	},
	    _createRoughEase = function _createRoughEase(vars) {
	  if (typeof vars !== "object") {
	    vars = {
	      points: +vars || 20
	    };
	  }

	  var taper = vars.taper || "none",
	      a = [],
	      cnt = 0,
	      points = (+vars.points || 20) | 0,
	      i = points,
	      randomize = _boolean(vars.randomize, true),
	      clamp = _boolean(vars.clamp),
	      template = gsap ? gsap.parseEase(vars.template) : 0,
	      strength = (+vars.strength || 1) * 0.4,
	      x,
	      y,
	      bump,
	      invX,
	      obj,
	      pnt,
	      recent;

	  while (--i > -1) {
	    x = randomize ? Math.random() : 1 / points * i;
	    y = template ? template(x) : x;

	    if (taper === "none") {
	      bump = strength;
	    } else if (taper === "out") {
	      invX = 1 - x;
	      bump = invX * invX * strength;
	    } else if (taper === "in") {
	      bump = x * x * strength;
	    } else if (x < 0.5) {
	      invX = x * 2;
	      bump = invX * invX * 0.5 * strength;
	    } else {
	      invX = (1 - x) * 2;
	      bump = invX * invX * 0.5 * strength;
	    }

	    if (randomize) {
	      y += Math.random() * bump - bump * 0.5;
	    } else if (i % 2) {
	      y += bump * 0.5;
	    } else {
	      y -= bump * 0.5;
	    }

	    if (clamp) {
	      if (y > 1) {
	        y = 1;
	      } else if (y < 0) {
	        y = 0;
	      }
	    }

	    a[cnt++] = {
	      x: x,
	      y: y
	    };
	  }

	  a.sort(function (a, b) {
	    return a.x - b.x;
	  });
	  pnt = new EasePoint(1, 1, null);
	  i = points;

	  while (i--) {
	    obj = a[i];
	    pnt = new EasePoint(obj.x, obj.y, pnt);
	  }

	  recent = new EasePoint(0, 0, pnt.t ? pnt : pnt.next);
	  return function (p) {
	    var pnt = recent;

	    if (p > pnt.t) {
	      while (pnt.next && p >= pnt.t) {
	        pnt = pnt.next;
	      }

	      pnt = pnt.prev;
	    } else {
	      while (pnt.prev && p <= pnt.t) {
	        pnt = pnt.prev;
	      }
	    }

	    recent = pnt;
	    return pnt.v + (p - pnt.t) / pnt.gap * pnt.c;
	  };
	};

	var SlowMo = _createSlowMo(0.7);
	SlowMo.ease = SlowMo;
	SlowMo.config = _createSlowMo;
	var ExpoScaleEase = _createExpoScale(1, 2);
	ExpoScaleEase.config = _createExpoScale;
	var RoughEase = _createRoughEase();
	RoughEase.ease = RoughEase;
	RoughEase.config = _createRoughEase;
	var EasePack = {
	  SlowMo: SlowMo,
	  RoughEase: RoughEase,
	  ExpoScaleEase: ExpoScaleEase
	};

	for (var p in EasePack) {
	  EasePack[p].register = _initCore;
	  EasePack[p].version = "3.5.1";
	}

	_getGSAP() && gsap.registerPlugin(SlowMo);

	exports.EasePack = EasePack;
	exports.ExpoScaleEase = ExpoScaleEase;
	exports.RoughEase = RoughEase;
	exports.SlowMo = SlowMo;
	exports.default = EasePack;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /*!
   * GSAP 3.5.1
   * https://greensock.com
   *
   * @license Copyright 2008-2020, GreenSock. All rights reserved.
   * Subject to the terms at https://greensock.com/standard-license or for
   * Club GreenSock members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  */
  var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  },
      _defaults = {
    duration: .5,
    overwrite: false,
    delay: 0
  },
      _bigNum = 1e8,
      _tinyNum = 1 / _bigNum,
      _2PI = Math.PI * 2,
      _HALF_PI = _2PI / 4,
      _gsID = 0,
      _sqrt = Math.sqrt,
      _cos = Math.cos,
      _sin = Math.sin,
      _isString = function _isString(value) {
    return typeof value === "string";
  },
      _isFunction = function _isFunction(value) {
    return typeof value === "function";
  },
      _isNumber = function _isNumber(value) {
    return typeof value === "number";
  },
      _isUndefined = function _isUndefined(value) {
    return typeof value === "undefined";
  },
      _isObject = function _isObject(value) {
    return typeof value === "object";
  },
      _isNotFalse = function _isNotFalse(value) {
    return value !== false;
  },
      _windowExists = function _windowExists() {
    return typeof window !== "undefined";
  },
      _isFuncOrString = function _isFuncOrString(value) {
    return _isFunction(value) || _isString(value);
  },
      _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
      _isArray = Array.isArray,
      _strictNumExp = /(?:-?\.?\d|\.)+/gi,
      _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-\+]*\d*/g,
      _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
      _complexStringNumExp = /[-+=.]*\d+(?:\.|e-|e)*\d*/gi,
      _relExp = /[+-]=-?[\.\d]+/,
      _delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
      _globalTimeline,
      _win,
      _coreInitted,
      _doc,
      _globals = {},
      _installScope = {},
      _coreReady,
      _install = function _install(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap;
  },
      _missingPlugin = function _missingPlugin(property, value) {
    return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
  },
      _warn = function _warn(message, suppress) {
    return !suppress && console.warn(message);
  },
      _addGlobal = function _addGlobal(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
  },
      _emptyFunc = function _emptyFunc() {
    return 0;
  },
      _reservedProps = {},
      _lazyTweens = [],
      _lazyLookup = {},
      _lastRenderedFrame,
      _plugins = {},
      _effects = {},
      _nextGCFrame = 30,
      _harnessPlugins = [],
      _callbackNames = "",
      _harness = function _harness(targets) {
    var target = targets[0],
        harnessPlugin,
        i;
    _isObject(target) || _isFunction(target) || (targets = [targets]);

    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i = _harnessPlugins.length;

      while (i-- && !_harnessPlugins[i].targetTest(target)) {}

      harnessPlugin = _harnessPlugins[i];
    }

    i = targets.length;

    while (i--) {
      targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
    }

    return targets;
  },
      _getCache = function _getCache(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap;
  },
      _getProperty = function _getProperty(target, property, v) {
    return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
  },
      _forEachName = function _forEachName(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  },
      _round = function _round(value) {
    return Math.round(value * 100000) / 100000 || 0;
  },
      _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
    var l = toFind.length,
        i = 0;

    for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

    return i < l;
  },
      _parseVars = function _parseVars(params, type, parent) {
    var isLegacy = _isNumber(params[1]),
        varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
        vars = params[varsIndex],
        irVars;

    isLegacy && (vars.duration = params[1]);
    vars.parent = parent;

    if (type) {
      irVars = vars;

      while (parent && !("immediateRender" in irVars)) {
        irVars = parent.vars.defaults || {};
        parent = _isNotFalse(parent.vars.inherit) && parent.parent;
      }

      vars.immediateRender = _isNotFalse(irVars.immediateRender);
      type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
    }

    return vars;
  },
      _lazyRender = function _lazyRender() {
    var l = _lazyTweens.length,
        a = _lazyTweens.slice(0),
        i,
        tween;

    _lazyLookup = {};
    _lazyTweens.length = 0;

    for (i = 0; i < l; i++) {
      tween = a[i];
      tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
    }
  },
      _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
    _lazyTweens.length && _lazyRender();
    animation.render(time, suppressEvents, force);
    _lazyTweens.length && _lazyRender();
  },
      _numericIfPossible = function _numericIfPossible(value) {
    var n = parseFloat(value);
    return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
  },
      _passThrough = function _passThrough(p) {
    return p;
  },
      _setDefaults = function _setDefaults(obj, defaults) {
    for (var p in defaults) {
      p in obj || (obj[p] = defaults[p]);
    }

    return obj;
  },
      _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
    for (var p in defaults) {
      p in obj || p === "duration" || p === "ease" || (obj[p] = defaults[p]);
    }
  },
      _merge = function _merge(base, toMerge) {
    for (var p in toMerge) {
      base[p] = toMerge[p];
    }

    return base;
  },
      _mergeDeep = function _mergeDeep(base, toMerge) {
    for (var p in toMerge) {
      base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p];
    }

    return base;
  },
      _copyExcluding = function _copyExcluding(obj, excluding) {
    var copy = {},
        p;

    for (p in obj) {
      p in excluding || (copy[p] = obj[p]);
    }

    return copy;
  },
      _inheritDefaults = function _inheritDefaults(vars) {
    var parent = vars.parent || _globalTimeline,
        func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;

    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent || parent._dp;
      }
    }

    return vars;
  },
      _arraysMatch = function _arraysMatch(a1, a2) {
    var i = a1.length,
        match = i === a2.length;

    while (match && i-- && a1[i] === a2[i]) {}

    return i < 0;
  },
      _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }

    if (lastProp === void 0) {
      lastProp = "_last";
    }

    var prev = parent[lastProp],
        t;

    if (sortBy) {
      t = child[sortBy];

      while (prev && prev[sortBy] > t) {
        prev = prev._prev;
      }
    }

    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }

    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }

    child._prev = prev;
    child.parent = child._dp = parent;
    return child;
  },
      _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }

    if (lastProp === void 0) {
      lastProp = "_last";
    }

    var prev = child._prev,
        next = child._next;

    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }

    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }

    child._next = child._prev = child.parent = null;
  },
      _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
    child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child);
    child._act = 0;
  },
      _uncache = function _uncache(animation, child) {
    if (animation && (!child || child._end > animation._dur || child._start < 0)) {
      var a = animation;

      while (a) {
        a._dirty = 1;
        a = a.parent;
      }
    }

    return animation;
  },
      _recacheAncestors = function _recacheAncestors(animation) {
    var parent = animation.parent;

    while (parent && parent.parent) {
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }

    return animation;
  },
      _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
  },
      _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
    return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
  },
      _animationCycle = function _animationCycle(tTime, cycleDuration) {
    return (tTime /= cycleDuration) && ~~tTime === tTime ? ~~tTime - 1 : ~~tTime;
  },
      _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
    return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
  },
      _setEnd = function _setEnd(animation) {
    return animation._end = _round(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
  },
      _alignPlayhead = function _alignPlayhead(animation, totalTime) {
    var parent = animation._dp;

    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _round(animation._dp._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));

      _setEnd(animation);

      parent._dirty || _uncache(parent, animation);
    }

    return animation;
  },
      _postAddChecks = function _postAddChecks(timeline, child) {
    var t;

    if (child._time || child._initted && !child._dur) {
      t = _parentToChildTotalTime(timeline.rawTime(), child);

      if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
        child.render(t, true);
      }
    }

    if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
      if (timeline._dur < timeline.duration()) {
        t = timeline;

        while (t._dp) {
          t.rawTime() >= 0 && t.totalTime(t._tTime);
          t = t._dp;
        }
      }

      timeline._zTime = -_tinyNum;
    }
  },
      _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
    child.parent && _removeFromParent(child);
    child._start = _round(position + child._delay);
    child._end = _round(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

    _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

    timeline._recent = child;
    skipChecks || _postAddChecks(timeline, child);
    return timeline;
  },
      _scrollTrigger = function _scrollTrigger(animation, trigger) {
    return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
  },
      _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
    _initTween(tween, totalTime);

    if (!tween._initted) {
      return 1;
    }

    if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
      _lazyTweens.push(tween);

      tween._lazy = [totalTime, suppressEvents];
      return 1;
    }
  },
      _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
    var prevRatio = tween.ratio,
        ratio = totalTime < 0 || !totalTime && prevRatio && !tween._start && tween._zTime > _tinyNum && !tween._dp._lock || (tween._ts < 0 || tween._dp._ts < 0) && tween.data !== "isFromStart" && tween.data !== "isStart" ? 0 : 1,
        repeatDelay = tween._rDelay,
        tTime = 0,
        pt,
        iteration,
        prevIteration;

    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = _animationCycle(tTime, repeatDelay);
      prevIteration = _animationCycle(tween._tTime, repeatDelay);

      if (iteration !== prevIteration) {
        prevRatio = 1 - ratio;
        tween.vars.repeatRefresh && tween._initted && tween.invalidate();
      }
    }

    if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
        return;
      }

      prevIteration = tween._zTime;
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
      suppressEvents || (suppressEvents = totalTime && !prevIteration);
      tween.ratio = ratio;
      tween._from && (ratio = 1 - ratio);
      tween._time = 0;
      tween._tTime = tTime;
      suppressEvents || _callback(tween, "onStart");
      pt = tween._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
      tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
      tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");

      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        ratio && _removeFromParent(tween, 1);

        if (!suppressEvents) {
          _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);

          tween._prom && tween._prom();
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime;
    }
  },
      _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
    var child;

    if (time > prevTime) {
      child = animation._first;

      while (child && child._start <= time) {
        if (!child._dur && child.data === "isPause" && child._start > prevTime) {
          return child;
        }

        child = child._next;
      }
    } else {
      child = animation._last;

      while (child && child._start >= time) {
        if (!child._dur && child.data === "isPause" && child._start < prevTime) {
          return child;
        }

        child = child._prev;
      }
    }
  },
      _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
    var repeat = animation._repeat,
        dur = _round(duration) || 0,
        totalProgress = animation._tTime / animation._tDur;
    totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
    animation._dur = dur;
    animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _round(dur * (repeat + 1) + animation._rDelay * repeat);
    totalProgress && !leavePlayhead ? _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress) : animation.parent && _setEnd(animation);
    skipUncache || _uncache(animation.parent, animation);
    return animation;
  },
      _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
    return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
  },
      _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc
  },
      _parsePosition = function _parsePosition(animation, position) {
    var labels = animation.labels,
        recent = animation._recent || _zeroPosition,
        clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
        i,
        offset;

    if (_isString(position) && (isNaN(position) || position in labels)) {
      i = position.charAt(0);

      if (i === "<" || i === ">") {
        return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
      }

      i = position.indexOf("=");

      if (i < 0) {
        position in labels || (labels[position] = clippedDuration);
        return labels[position];
      }

      offset = +(position.charAt(i - 1) + position.substr(i + 1));
      return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset;
    }

    return position == null ? clippedDuration : +position;
  },
      _conditionalReturn = function _conditionalReturn(value, func) {
    return value || value === 0 ? func(value) : func;
  },
      _clamp = function _clamp(min, max, value) {
    return value < min ? min : value > max ? max : value;
  },
      getUnit = function getUnit(value) {
    return (value = (value + "").substr((parseFloat(value) + "").length)) && isNaN(value) ? value : "";
  },
      clamp = function clamp(min, max, value) {
    return _conditionalReturn(value, function (v) {
      return _clamp(min, max, v);
    });
  },
      _slice = [].slice,
      _isArrayLike = function _isArrayLike(value, nonEmpty) {
    return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
  },
      _flatten = function _flatten(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }

    return ar.forEach(function (value) {
      var _accumulator;

      return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
    }) || accumulator;
  },
      toArray = function toArray(value, leaveStrings) {
    return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
  },
      shuffle = function shuffle(a) {
    return a.sort(function () {
      return .5 - Math.random();
    });
  },
      distribute = function distribute(v) {
    if (_isFunction(v)) {
      return v;
    }

    var vars = _isObject(v) ? v : {
      each: v
    },
        ease = _parseEase(vars.ease),
        from = vars.from || 0,
        base = parseFloat(vars.base) || 0,
        cache = {},
        isDecimal = from > 0 && from < 1,
        ratios = isNaN(from) || isDecimal,
        axis = vars.axis,
        ratioX = from,
        ratioY = from;

    if (_isString(from)) {
      ratioX = ratioY = {
        center: .5,
        edges: .5,
        end: 1
      }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }

    return function (i, target, a) {
      var l = (a || vars).length,
          distances = cache[l],
          originX,
          originY,
          x,
          y,
          d,
          j,
          max,
          min,
          wrapAt;

      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

        if (!wrapAt) {
          max = -_bigNum;

          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

          wrapAt--;
        }

        distances = cache[l] = [];
        originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
        originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
        max = 0;
        min = _bigNum;

        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX;
          y = originY - (j / wrapAt | 0);
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
          d > max && (max = d);
          d < min && (min = d);
        }

        from === "random" && shuffle(distances);
        distances.max = max - min;
        distances.min = min;
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
        distances.b = l < 0 ? base - l : base;
        distances.u = getUnit(vars.amount || vars.each) || 0;
        ease = ease && l < 0 ? _invertEase(ease) : ease;
      }

      l = (distances[i] - distances.min) / distances.max || 0;
      return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
    };
  },
      _roundModifier = function _roundModifier(v) {
    var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1;
    return function (raw) {
      return Math.floor(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw));
    };
  },
      snap = function snap(snapTo, value) {
    var isArray = _isArray(snapTo),
        radius,
        is2D;

    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum;

      if (snapTo.values) {
        snapTo = toArray(snapTo.values);

        if (is2D = !_isNumber(snapTo[0])) {
          radius *= radius;
        }
      } else {
        snapTo = _roundModifier(snapTo.increment);
      }
    }

    return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
      is2D = snapTo(raw);
      return Math.abs(is2D - raw) <= radius ? is2D : raw;
    } : function (raw) {
      var x = parseFloat(is2D ? raw.x : raw),
          y = parseFloat(is2D ? raw.y : 0),
          min = _bigNum,
          closest = 0,
          i = snapTo.length,
          dx,
          dy;

      while (i--) {
        if (is2D) {
          dx = snapTo[i].x - x;
          dy = snapTo[i].y - y;
          dx = dx * dx + dy * dy;
        } else {
          dx = Math.abs(snapTo[i] - x);
        }

        if (dx < min) {
          min = dx;
          closest = i;
        }
      }

      closest = !radius || min <= radius ? snapTo[closest] : raw;
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
    });
  },
      random = function random(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
      return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
    });
  },
      pipe = function pipe() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }

    return function (value) {
      return functions.reduce(function (v, f) {
        return f(v);
      }, value);
    };
  },
      unitize = function unitize(func, unit) {
    return function (value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  },
      normalize = function normalize(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  },
      _wrapArray = function _wrapArray(a, wrapper, value) {
    return _conditionalReturn(value, function (index) {
      return a[~~wrapper(index)];
    });
  },
      wrap = function wrap(min, max, value) {
    var range = max - min;
    return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
      return (range + (value - min) % range) % range + min;
    });
  },
      wrapYoyo = function wrapYoyo(min, max, value) {
    var range = max - min,
        total = range * 2;
    return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
      value = (total + (value - min) % total) % total || 0;
      return min + (value > range ? total - value : value);
    });
  },
      _replaceRandom = function _replaceRandom(value) {
    var prev = 0,
        s = "",
        i,
        nums,
        end,
        isArray;

    while (~(i = value.indexOf("random(", prev))) {
      end = value.indexOf(")", i);
      isArray = value.charAt(i + 7) === "[";
      nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
      s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
      prev = end + 1;
    }

    return s + value.substr(prev, value.length - prev);
  },
      mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin,
        outRange = outMax - outMin;
    return _conditionalReturn(value, function (value) {
      return outMin + ((value - inMin) / inRange * outRange || 0);
    });
  },
      interpolate = function interpolate(start, end, progress, mutate) {
    var func = isNaN(start + end) ? 0 : function (p) {
      return (1 - p) * start + p * end;
    };

    if (!func) {
      var isString = _isString(start),
          master = {},
          p,
          i,
          interpolators,
          l,
          il;

      progress === true && (mutate = 1) && (progress = null);

      if (isString) {
        start = {
          p: start
        };
        end = {
          p: end
        };
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = [];
        l = start.length;
        il = l - 2;

        for (i = 1; i < l; i++) {
          interpolators.push(interpolate(start[i - 1], start[i]));
        }

        l--;

        func = function func(p) {
          p *= l;
          var i = Math.min(il, ~~p);
          return interpolators[i](p - i);
        };

        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start);
      }

      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, "get", end[p]);
        }

        func = function func(p) {
          return _renderPropTweens(p, master) || (isString ? start.p : start);
        };
      }
    }

    return _conditionalReturn(progress, func);
  },
      _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
    var labels = timeline.labels,
        min = _bigNum,
        p,
        distance,
        label;

    for (p in labels) {
      distance = labels[p] - fromTime;

      if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
        label = p;
        min = distance;
      }
    }

    return label;
  },
      _callback = function _callback(animation, type, executeLazyFirst) {
    var v = animation.vars,
        callback = v[type],
        params,
        scope;

    if (!callback) {
      return;
    }

    params = v[type + "Params"];
    scope = v.callbackScope || animation;
    executeLazyFirst && _lazyTweens.length && _lazyRender();
    return params ? callback.apply(scope, params) : callback.call(scope);
  },
      _interrupt = function _interrupt(animation) {
    _removeFromParent(animation);

    animation.progress() < 1 && _callback(animation, "onInterrupt");
    return animation;
  },
      _quickTween,
      _createPlugin = function _createPlugin(config) {
    config = !config.name && config["default"] || config;

    var name = config.name,
        isFunc = _isFunction(config),
        Plugin = name && !isFunc && config.init ? function () {
      this._props = [];
    } : config,
        instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    },
        statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };

    _wake();

    if (config !== Plugin) {
      if (_plugins[name]) {
        return;
      }

      _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics));

      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));

      _plugins[Plugin.prop = name] = Plugin;

      if (config.targetTest) {
        _harnessPlugins.push(Plugin);

        _reservedProps[name] = 1;
      }

      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }

    _addGlobal(name, Plugin);

    config.register && config.register(gsap, Plugin, PropTween);
  },
      _255 = 255,
      _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0]
  },
      _hue = function _hue(h, m1, m2) {
    h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
  },
      splitColor = function splitColor(v, toHSL, forceAlpha) {
    var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
        r,
        g,
        b,
        h,
        s,
        l,
        max,
        min,
        d,
        wasHSL;

    if (!a) {
      if (v.substr(-1) === ",") {
        v = v.substr(0, v.length - 1);
      }

      if (_colorLookup[v]) {
        a = _colorLookup[v];
      } else if (v.charAt(0) === "#") {
        if (v.length === 4) {
          r = v.charAt(1);
          g = v.charAt(2);
          b = v.charAt(3);
          v = "#" + r + r + g + g + b + b;
        }

        v = parseInt(v.substr(1), 16);
        a = [v >> 16, v >> 8 & _255, v & _255];
      } else if (v.substr(0, 3) === "hsl") {
        a = wasHSL = v.match(_strictNumExp);

        if (!toHSL) {
          h = +a[0] % 360 / 360;
          s = +a[1] / 100;
          l = +a[2] / 100;
          g = l <= .5 ? l * (s + 1) : l + s - l * s;
          r = l * 2 - g;
          a.length > 3 && (a[3] *= 1);
          a[0] = _hue(h + 1 / 3, r, g);
          a[1] = _hue(h, r, g);
          a[2] = _hue(h - 1 / 3, r, g);
        } else if (~v.indexOf("=")) {
          a = v.match(_numExp);
          forceAlpha && a.length < 4 && (a[3] = 1);
          return a;
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent;
      }

      a = a.map(Number);
    }

    if (toHSL && !wasHSL) {
      r = a[0] / _255;
      g = a[1] / _255;
      b = a[2] / _255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
      }

      a[0] = ~~(h + .5);
      a[1] = ~~(s * 100 + .5);
      a[2] = ~~(l * 100 + .5);
    }

    forceAlpha && a.length < 4 && (a[3] = 1);
    return a;
  },
      _colorOrderData = function _colorOrderData(v) {
    var values = [],
        c = [],
        i = -1;
    v.split(_colorExp).forEach(function (v) {
      var a = v.match(_numWithUnitExp) || [];
      values.push.apply(values, a);
      c.push(i += a.length + 1);
    });
    values.c = c;
    return values;
  },
      _formatColors = function _formatColors(s, toHSL, orderMatchData) {
    var result = "",
        colors = (s + result).match(_colorExp),
        type = toHSL ? "hsla(" : "rgba(",
        i = 0,
        c,
        shell,
        d,
        l;

    if (!colors) {
      return s;
    }

    colors = colors.map(function (color) {
      return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
    });

    if (orderMatchData) {
      d = _colorOrderData(s);
      c = orderMatchData.c;

      if (c.join(result) !== d.c.join(result)) {
        shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
        l = shell.length - 1;

        for (; i < l; i++) {
          result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
        }
      }
    }

    if (!shell) {
      shell = s.split(_colorExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + colors[i];
      }
    }

    return result + shell[l];
  },
      _colorExp = function () {
    var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b",
        p;

    for (p in _colorLookup) {
      s += "|" + p + "\\b";
    }

    return new RegExp(s + ")", "gi");
  }(),
      _hslExp = /hsl[a]?\(/,
      _colorStringFilter = function _colorStringFilter(a) {
    var combined = a.join(" "),
        toHSL;
    _colorExp.lastIndex = 0;

    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a[1] = _formatColors(a[1], toHSL);
      a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
      return true;
    }
  },
      _tickerActive,
      _ticker = function () {
    var _getTime = Date.now,
        _lagThreshold = 500,
        _adjustedLag = 33,
        _startTime = _getTime(),
        _lastUpdate = _startTime,
        _gap = 1000 / 240,
        _nextTime = _gap,
        _listeners = [],
        _id,
        _req,
        _raf,
        _self,
        _delta,
        _i,
        _tick = function _tick(v) {
      var elapsed = _getTime() - _lastUpdate,
          manual = v === true,
          overlap,
          dispatch,
          time,
          frame;

      elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
      _lastUpdate += elapsed;
      time = _lastUpdate - _startTime;
      overlap = time - _nextTime;

      if (overlap > 0 || manual) {
        frame = ++_self.frame;
        _delta = time - _self.time * 1000;
        _self.time = time = time / 1000;
        _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
        dispatch = 1;
      }

      manual || (_id = _req(_tick));

      if (dispatch) {
        for (_i = 0; _i < _listeners.length; _i++) {
          _listeners[_i](time, _delta, frame, v);
        }
      }
    };

    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1000 / (fps || 60));
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists()) {
            _win = _coreInitted = window;
            _doc = _win.document || {};
            _globals.gsap = gsap;
            (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

            _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

            _raf = _win.requestAnimationFrame;
          }

          _id && _self.sleep();

          _req = _raf || function (f) {
            return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
          };

          _tickerActive = 1;

          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || 1 / _tinyNum;
        _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
      },
      fps: function fps(_fps) {
        _gap = 1000 / (_fps || 240);
        _nextTime = _self.time * 1000 + _gap;
      },
      add: function add(callback) {
        _listeners.indexOf(callback) < 0 && _listeners.push(callback);

        _wake();
      },
      remove: function remove(callback) {
        var i;
        ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
      },
      _listeners: _listeners
    };
    return _self;
  }(),
      _wake = function _wake() {
    return !_tickerActive && _ticker.wake();
  },
      _easeMap = {},
      _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
      _quotesExp = /["']/g,
      _parseObjectInString = function _parseObjectInString(value) {
    var obj = {},
        split = value.substr(1, value.length - 3).split(":"),
        key = split[0],
        i = 1,
        l = split.length,
        index,
        val,
        parsedVal;

    for (; i < l; i++) {
      val = split[i];
      index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
      key = val.substr(index + 1).trim();
    }

    return obj;
  },
      _valueInParentheses = function _valueInParentheses(value) {
    var open = value.indexOf("(") + 1,
        close = value.indexOf(")"),
        nested = value.indexOf("(", open);
    return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
  },
      _configEaseFromString = function _configEaseFromString(name) {
    var split = (name + "").split("("),
        ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
  },
      _invertEase = function _invertEase(ease) {
    return function (p) {
      return 1 - ease(1 - p);
    };
  },
      _propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
    var child = timeline._first,
        ease;

    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase(child, isYoyo);
      } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
        if (child.timeline) {
          _propagateYoyoEase(child.timeline, isYoyo);
        } else {
          ease = child._ease;
          child._ease = child._yEase;
          child._yEase = ease;
          child._yoyo = isYoyo;
        }
      }

      child = child._next;
    }
  },
      _parseEase = function _parseEase(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  },
      _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut(p) {
        return 1 - easeIn(1 - p);
      };
    }

    if (easeInOut === void 0) {
      easeInOut = function easeInOut(p) {
        return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
      };
    }

    var ease = {
      easeIn: easeIn,
      easeOut: easeOut,
      easeInOut: easeInOut
    },
        lowercaseName;

    _forEachName(names, function (name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

      for (var p in ease) {
        _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
      }
    });

    return ease;
  },
      _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
    return function (p) {
      return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
    };
  },
      _configElastic = function _configElastic(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1,
        p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
        p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
        easeOut = function easeOut(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
    },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

    p2 = _2PI / p2;

    ease.config = function (amplitude, period) {
      return _configElastic(type, amplitude, period);
    };

    return ease;
  },
      _configBack = function _configBack(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }

    var easeOut = function easeOut(p) {
      return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
    },
        ease = type === "out" ? easeOut : type === "in" ? function (p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);

    ease.config = function (overshoot) {
      return _configBack(type, overshoot);
    };

    return ease;
  };

  _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
    var power = i < 5 ? i + 1 : i;

    _insertEase(name + ",Power" + (power - 1), i ? function (p) {
      return Math.pow(p, power);
    } : function (p) {
      return p;
    }, function (p) {
      return 1 - Math.pow(1 - p, power);
    }, function (p) {
      return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
    });
  });

  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

  _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

  (function (n, c) {
    var n1 = 1 / c,
        n2 = 2 * n1,
        n3 = 2.5 * n1,
        easeOut = function easeOut(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
    };

    _insertEase("Bounce", function (p) {
      return 1 - easeOut(1 - p);
    }, easeOut);
  })(7.5625, 2.75);

  _insertEase("Expo", function (p) {
    return p ? Math.pow(2, 10 * (p - 1)) : 0;
  });

  _insertEase("Circ", function (p) {
    return -(_sqrt(1 - p * p) - 1);
  });

  _insertEase("Sine", function (p) {
    return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
  });

  _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1;
      }

      var p1 = 1 / steps,
          p2 = steps + (immediateStart ? 0 : 1),
          p3 = immediateStart ? 1 : 0,
          max = 1 - _tinyNum;
      return function (p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
      };
    }
  };
  _defaults.ease = _easeMap["quad.out"];

  _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
    return _callbackNames += name + "," + name + "Params,";
  });

  var GSCache = function GSCache(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter;
  };
  var Animation = function () {
    function Animation(vars, time) {
      var parent = vars.parent || _globalTimeline;
      this.vars = vars;
      this._delay = +vars.delay || 0;

      if (this._repeat = vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
      }

      this._ts = 1;

      _setDuration(this, +vars.duration, 1, 1);

      this.data = vars.data;
      _tickerActive || _ticker.wake();
      parent && _addToTimeline(parent, this, time || time === 0 ? time : parent._time, 1);
      vars.reversed && this.reverse();
      vars.paused && this.paused(true);
    }

    var _proto = Animation.prototype;

    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
        this._delay = value;
        return this;
      }

      return this._delay;
    };

    _proto.duration = function duration(value) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
    };

    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur;
      }

      this._dirty = 0;
      return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
    };

    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake();

      if (!arguments.length) {
        return this._tTime;
      }

      var parent = this._dp;

      if (parent && parent.smoothChildTiming && this._ts) {
        _alignPlayhead(this, _totalTime);

        while (parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true);
          }

          parent = parent.parent;
        }

        if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
          _addToTimeline(this._dp, this, this._start - this._delay);
        }
      }

      if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
        this._ts || (this._pTime = _totalTime);

        _lazySafeRender(this, _totalTime, suppressEvents);
      }

      return this;
    };

    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time;
    };

    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
    };

    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
    };

    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;

      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
    };

    _proto.timeScale = function timeScale(value) {
      if (!arguments.length) {
        return this._rts === -_tinyNum ? 0 : this._rts;
      }

      if (this._rts === value) {
        return this;
      }

      var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
      this._rts = +value || 0;
      this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
      return _recacheAncestors(this.totalTime(_clamp(-this._delay, this._tDur, tTime), true));
    };

    _proto.paused = function paused(value) {
      if (!arguments.length) {
        return this._ps;
      }

      if (this._ps !== value) {
        this._ps = value;

        if (value) {
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
          this._ts = this._act = 0;
        } else {
          _wake();

          this._ts = this._rts;
          this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum);
        }
      }

      return this;
    };

    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        this._start = value;
        var parent = this.parent || this._dp;
        parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
        return this;
      }

      return this._start;
    };

    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
    };

    _proto.rawTime = function rawTime(wrapRepeats) {
      var parent = this.parent || this._dp;
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
    };

    _proto.globalTime = function globalTime(rawTime) {
      var animation = this,
          time = arguments.length ? rawTime : animation.rawTime();

      while (animation) {
        time = animation._start + time / (animation._ts || 1);
        animation = animation._dp;
      }

      return time;
    };

    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value;
        return _onUpdateTotalDuration(this);
      }

      return this._repeat;
    };

    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        this._rDelay = value;
        return _onUpdateTotalDuration(this);
      }

      return this._rDelay;
    };

    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value;
        return this;
      }

      return this._yoyo;
    };

    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
    };

    _proto.restart = function restart(includeDelay, suppressEvents) {
      return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
    };

    _proto.play = function play(from, suppressEvents) {
      from != null && this.seek(from, suppressEvents);
      return this.reversed(false).paused(false);
    };

    _proto.reverse = function reverse(from, suppressEvents) {
      from != null && this.seek(from || this.totalDuration(), suppressEvents);
      return this.reversed(true).paused(false);
    };

    _proto.pause = function pause(atTime, suppressEvents) {
      atTime != null && this.seek(atTime, suppressEvents);
      return this.paused(true);
    };

    _proto.resume = function resume() {
      return this.paused(false);
    };

    _proto.reversed = function reversed(value) {
      if (arguments.length) {
        !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
        return this;
      }

      return this._rts < 0;
    };

    _proto.invalidate = function invalidate() {
      this._initted = 0;
      this._zTime = -_tinyNum;
      return this;
    };

    _proto.isActive = function isActive() {
      var parent = this.parent || this._dp,
          start = this._start,
          rawTime;
      return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
    };

    _proto.eventCallback = function eventCallback(type, callback, params) {
      var vars = this.vars;

      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type];
        } else {
          vars[type] = callback;
          params && (vars[type + "Params"] = params);
          type === "onUpdate" && (this._onUpdate = callback);
        }

        return this;
      }

      return vars[type];
    };

    _proto.then = function then(onFulfilled) {
      var self = this;
      return new Promise(function (resolve) {
        var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
            _resolve = function _resolve() {
          var _then = self.then;
          self.then = null;
          _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
          resolve(f);
          self.then = _then;
        };

        if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
          _resolve();
        } else {
          self._prom = _resolve;
        }
      });
    };

    _proto.kill = function kill() {
      _interrupt(this);
    };

    return Animation;
  }();

  _setDefaults(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: null,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0,
    _ps: false,
    _rts: 1
  });

  var Timeline = function (_Animation) {
    _inheritsLoose(Timeline, _Animation);

    function Timeline(vars, time) {
      var _this;

      if (vars === void 0) {
        vars = {};
      }

      _this = _Animation.call(this, vars, time) || this;
      _this.labels = {};
      _this.smoothChildTiming = !!vars.smoothChildTiming;
      _this.autoRemoveChildren = !!vars.autoRemoveChildren;
      _this._sort = _isNotFalse(vars.sortChildren);
      _this.parent && _postAddChecks(_this.parent, _assertThisInitialized(_this));
      vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
      return _this;
    }

    var _proto2 = Timeline.prototype;

    _proto2.to = function to(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
      return this;
    };

    _proto2.from = function from(targets, vars, position) {
      new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
      return this;
    };

    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
      return this;
    };

    _proto2.set = function set(targets, vars, position) {
      vars.duration = 0;
      vars.parent = this;
      _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
      vars.immediateRender = !!vars.immediateRender;
      new Tween(targets, vars, _parsePosition(this, position), 1);
      return this;
    };

    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
    };

    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition(this, position));
      return this;
    };

    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1;
      _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
    };

    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars;
      _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
    };

    _proto2.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
          tDur = this._dirty ? this.totalDuration() : this._tDur,
          dur = this._dur,
          tTime = this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
          crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
          time,
          child,
          next,
          iteration,
          cycleDuration,
          prevPaused,
          pauseTween,
          timeScale,
          prevStart,
          prevIteration,
          yoyo,
          isYoyo;

      if (tTime !== this._tTime || force || crossingStart) {
        if (prevTime !== this._time && dur) {
          tTime += this._time - prevTime;
          totalTime += this._time - prevTime;
        }

        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = !timeScale;

        if (crossingStart) {
          dur || (prevTime = this._zTime);
          (totalTime || !suppressEvents) && (this._zTime = totalTime);
        }

        if (this._repeat) {
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;
          time = _round(tTime % cycleDuration);

          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            iteration = ~~(tTime / cycleDuration);

            if (iteration && iteration === tTime / cycleDuration) {
              time = dur;
              iteration--;
            }

            time > dur && (time = dur);
          }

          prevIteration = _animationCycle(this._tTime, cycleDuration);
          !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration);

          if (yoyo && iteration & 1) {
            time = dur - time;
            isYoyo = 1;
          }

          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1,
                doesWrap = rewinding === (yoyo && iteration & 1);
            iteration < prevIteration && (rewinding = !rewinding);
            prevTime = rewinding ? 0 : dur;
            this._lock = 1;
            this.render(prevTime || (isYoyo ? 0 : _round(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
            !suppressEvents && this.parent && _callback(this, "onRepeat");
            this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

            if (prevTime !== this._time || prevPaused !== !this._ts) {
              return this;
            }

            dur = this._dur;
            tDur = this._tDur;

            if (doesWrap) {
              this._lock = 2;
              prevTime = rewinding ? dur : -0.0001;
              this.render(prevTime, true);
              this.vars.repeatRefresh && !isYoyo && this.invalidate();
            }

            this._lock = 0;

            if (!this._ts && !prevPaused) {
              return this;
            }

            _propagateYoyoEase(this, isYoyo);
          }
        }

        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));

          if (pauseTween) {
            tTime -= time - (time = pauseTween._start);
          }
        }

        this._tTime = tTime;
        this._time = time;
        this._act = !timeScale;

        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1;
          this._zTime = totalTime;
        }

        !prevTime && time && !suppressEvents && _callback(this, "onStart");

        if (time >= prevTime && totalTime >= 0) {
          child = this._first;

          while (child) {
            next = child._next;

            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }

              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = -_tinyNum);
                break;
              }
            }

            child = next;
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time;

          while (child) {
            next = child._prev;

            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }

              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                break;
              }
            }

            child = next;
          }
        }

        if (pauseTween && !suppressEvents) {
          this.pause();
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

          if (this._ts) {
            this._start = prevStart;

            _setEnd(this);

            return this.render(totalTime, suppressEvents, force);
          }
        }

        this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
        if (tTime === tDur && tDur >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
          (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);

          if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }

      return this;
    };

    _proto2.add = function add(child, position) {
      var _this2 = this;

      if (!_isNumber(position)) {
        position = _parsePosition(this, position);
      }

      if (!(child instanceof Animation)) {
        if (_isArray(child)) {
          child.forEach(function (obj) {
            return _this2.add(obj, position);
          });
          return this;
        }

        if (_isString(child)) {
          return this.addLabel(child, position);
        }

        if (_isFunction(child)) {
          child = Tween.delayedCall(0, child);
        } else {
          return this;
        }
      }

      return this !== child ? _addToTimeline(this, child, position) : this;
    };

    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = true;
      }

      if (tweens === void 0) {
        tweens = true;
      }

      if (timelines === void 0) {
        timelines = true;
      }

      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum;
      }

      var a = [],
          child = this._first;

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            tweens && a.push(child);
          } else {
            timelines && a.push(child);
            nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
          }
        }

        child = child._next;
      }

      return a;
    };

    _proto2.getById = function getById(id) {
      var animations = this.getChildren(1, 1, 1),
          i = animations.length;

      while (i--) {
        if (animations[i].vars.id === id) {
          return animations[i];
        }
      }
    };

    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child);
      }

      if (_isFunction(child)) {
        return this.killTweensOf(child);
      }

      _removeLinkedListItem(this, child);

      if (child === this._recent) {
        this._recent = this._last;
      }

      return _uncache(this);
    };

    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime;
      }

      this._forcing = 1;

      if (!this._dp && this._ts) {
        this._start = _round(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
      }

      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

      this._forcing = 0;
      return this;
    };

    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position);
      return this;
    };

    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label];
      return this;
    };

    _proto2.addPause = function addPause(position, callback, params) {
      var t = Tween.delayedCall(0, callback || _emptyFunc, params);
      t.data = "isPause";
      this._hasPause = 1;
      return _addToTimeline(this, t, _parsePosition(this, position));
    };

    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition(this, position);

      while (child) {
        if (child._start === position && child.data === "isPause") {
          _removeFromParent(child);
        }

        child = child._next;
      }
    };

    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      var tweens = this.getTweensOf(targets, onlyActive),
          i = tweens.length;

      while (i--) {
        _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
      }

      return this;
    };

    _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
      var a = [],
          parsedTargets = toArray(targets),
          child = this._first,
          isGlobalTime = _isNumber(onlyActive),
          children;

      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
            a.push(child);
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children);
        }

        child = child._next;
      }

      return a;
    };

    _proto2.tweenTo = function tweenTo(position, vars) {
      vars = vars || {};

      var tl = this,
          endTime = _parsePosition(tl, position),
          _vars = vars,
          startAt = _vars.startAt,
          _onStart = _vars.onStart,
          onStartParams = _vars.onStartParams,
          tween = Tween.to(tl, _setDefaults(vars, {
        ease: "none",
        lazy: false,
        time: endTime,
        overwrite: "auto",
        duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
        onStart: function onStart() {
          tl.pause();
          var duration = vars.duration || Math.abs((endTime - tl._time) / tl.timeScale());
          tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
          _onStart && _onStart.apply(tween, onStartParams || []);
        }
      }));

      return tween;
    };

    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults({
        startAt: {
          time: _parsePosition(this, fromPosition)
        }
      }, vars));
    };

    _proto2.recent = function recent() {
      return this._recent;
    };

    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time;
      }

      return _getLabelInDirection(this, _parsePosition(this, afterTime));
    };

    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time;
      }

      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
    };

    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
    };

    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0;
      }

      var child = this._first,
          labels = this.labels,
          p;

      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount;
          child._end += amount;
        }

        child = child._next;
      }

      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount;
          }
        }
      }

      return _uncache(this);
    };

    _proto2.invalidate = function invalidate() {
      var child = this._first;
      this._lock = 0;

      while (child) {
        child.invalidate();
        child = child._next;
      }

      return _Animation.prototype.invalidate.call(this);
    };

    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = true;
      }

      var child = this._first,
          next;

      while (child) {
        next = child._next;
        this.remove(child);
        child = next;
      }

      this._time = this._tTime = this._pTime = 0;
      includeLabels && (this.labels = {});
      return _uncache(this);
    };

    _proto2.totalDuration = function totalDuration(value) {
      var max = 0,
          self = this,
          child = self._last,
          prevStart = _bigNum,
          prev,
          start,
          parent;

      if (arguments.length) {
        return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
      }

      if (self._dirty) {
        parent = self.parent;

        while (child) {
          prev = child._prev;
          child._dirty && child.totalDuration();
          start = child._start;

          if (start > prevStart && self._sort && child._ts && !self._lock) {
            self._lock = 1;
            _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
          } else {
            prevStart = start;
          }

          if (start < 0 && child._ts) {
            max -= start;

            if (!parent && !self._dp || parent && parent.smoothChildTiming) {
              self._start += start / self._ts;
              self._time -= start;
              self._tTime -= start;
            }

            self.shiftChildren(-start, false, -1e999);
            prevStart = 0;
          }

          child._end > max && child._ts && (max = child._end);
          child = prev;
        }

        _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);

        self._dirty = 0;
      }

      return self._tDur;
    };

    Timeline.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

        _lastRenderedFrame = _ticker.frame;
      }

      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120;
        var child = _globalTimeline._first;
        if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
          while (child && !child._ts) {
            child = child._next;
          }

          child || _ticker.sleep();
        }
      }
    };

    return Timeline;
  }(Animation);

  _setDefaults(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });

  var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
    var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
        index = 0,
        matchIndex = 0,
        result,
        startNums,
        color,
        endNum,
        chunk,
        startNum,
        hasRandom,
        a;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";

    if (hasRandom = ~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (stringFilter) {
      a = [start, end];
      stringFilter(a, target, prop);
      start = a[0];
      end = a[1];
    }

    startNums = start.match(_complexStringNumExp) || [];

    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }

      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0;
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          s: startNum,
          c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0
        };
        index = _complexStringNumExp.lastIndex;
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : "";
    pt.fp = funcParam;

    if (_relExp.test(end) || hasRandom) {
      pt.e = 0;
    }

    this._pt = pt;
    return pt;
  },
      _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
    _isFunction(end) && (end = end(index || 0, target, targets));
    var currentValue = target[prop],
        parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
        setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
        pt;

    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }

      if (end.charAt(1) === "=") {
        end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
      }
    }

    if (parsedStart !== end) {
      if (!isNaN(parsedStart * end)) {
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
        funcParam && (pt.fp = funcParam);
        modifier && pt.modifier(modifier, this, target);
        return this._pt = pt;
      }

      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
    }
  },
      _processVars = function _processVars(vars, index, target, targets, tween) {
    _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));

    if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
    }

    var copy = {},
        p;

    for (p in vars) {
      copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
    }

    return copy;
  },
      _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
    var plugin, pt, ptLookup, i;

    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
        i = plugin._props.length;

        while (i--) {
          ptLookup[plugin._props[i]] = pt;
        }
      }
    }

    return plugin;
  },
      _overwritingTween,
      _initTween = function _initTween(tween, time) {
    var vars = tween.vars,
        ease = vars.ease,
        startAt = vars.startAt,
        immediateRender = vars.immediateRender,
        lazy = vars.lazy,
        onUpdate = vars.onUpdate,
        onUpdateParams = vars.onUpdateParams,
        callbackScope = vars.callbackScope,
        runBackwards = vars.runBackwards,
        yoyoEase = vars.yoyoEase,
        keyframes = vars.keyframes,
        autoRevert = vars.autoRevert,
        dur = tween._dur,
        prevStartAt = tween._startAt,
        targets = tween._targets,
        parent = tween.parent,
        fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
        autoOverwrite = tween._overwrite === "auto",
        tl = tween.timeline,
        cleanVars,
        i,
        p,
        pt,
        target,
        hasPriority,
        gsData,
        harness,
        plugin,
        ptLookup,
        index,
        harnessVars,
        overwritten;
    tl && (!keyframes || !ease) && (ease = "none");
    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }

    if (!tl) {
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop];
      cleanVars = _copyExcluding(vars, _reservedProps);
      prevStartAt && prevStartAt.render(-1, true).kill();

      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
          data: "isStart",
          overwrite: false,
          parent: parent,
          immediateRender: true,
          lazy: _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate: onUpdate,
          onUpdateParams: onUpdateParams,
          callbackScope: callbackScope,
          stagger: 0
        }, startAt)));

        if (immediateRender) {
          if (time > 0) {
            autoRevert || (tween._startAt = 0);
          } else if (dur && !(time < 0 && prevStartAt)) {
            time && (tween._zTime = time);
            return;
          }
        }
      } else if (runBackwards && dur) {
        if (prevStartAt) {
          !autoRevert && (tween._startAt = 0);
        } else {
          time && (immediateRender = false);
          p = _setDefaults({
            overwrite: false,
            data: "isFromStart",
            lazy: immediateRender && _isNotFalse(lazy),
            immediateRender: immediateRender,
            stagger: 0,
            parent: parent
          }, cleanVars);
          harnessVars && (p[harness.prop] = harnessVars);

          _removeFromParent(tween._startAt = Tween.set(targets, p));

          if (!immediateRender) {
            _initTween(tween._startAt, _tinyNum);
          } else if (!time) {
            return;
          }
        }
      }

      tween._pt = 0;
      lazy = dur && _isNotFalse(lazy) || lazy && !dur;

      for (i = 0; i < targets.length; i++) {
        target = targets[i];
        gsData = target._gsap || _harness(targets)[i]._gsap;
        tween._ptLookup[i] = ptLookup = {};
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
        index = fullTargets === targets ? i : fullTargets.indexOf(target);

        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

          plugin._props.forEach(function (name) {
            ptLookup[name] = pt;
          });

          plugin.priority && (hasPriority = 1);
        }

        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              plugin.priority && (hasPriority = 1);
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
            }
          }
        }

        tween._op && tween._op[i] && tween.kill(target, tween._op[i]);

        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween;

          _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(0));

          overwritten = !tween.parent;
          _overwritingTween = 0;
        }

        tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
      }

      hasPriority && _sortPropTweensByPriority(tween);
      tween._onInit && tween._onInit(tween);
    }

    tween._from = !tl && !!vars.runBackwards;
    tween._onUpdate = onUpdate;
    tween._initted = (!tween._op || tween._pt) && !overwritten;
  },
      _addAliasesToVars = function _addAliasesToVars(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0,
        propertyAliases = harness && harness.aliases,
        copy,
        p,
        i,
        aliases;

    if (!propertyAliases) {
      return vars;
    }

    copy = _merge({}, vars);

    for (p in propertyAliases) {
      if (p in copy) {
        aliases = propertyAliases[p].split(",");
        i = aliases.length;

        while (i--) {
          copy[aliases[i]] = copy[p];
        }
      }
    }

    return copy;
  },
      _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
    return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
  },
      _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
      _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger").split(",");

  var Tween = function (_Animation2) {
    _inheritsLoose(Tween, _Animation2);

    function Tween(targets, vars, time, skipInherit) {
      var _this3;

      if (typeof vars === "number") {
        time.duration = vars;
        vars = time;
        time = null;
      }

      _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars), time) || this;
      var _this3$vars = _this3.vars,
          duration = _this3$vars.duration,
          delay = _this3$vars.delay,
          immediateRender = _this3$vars.immediateRender,
          stagger = _this3$vars.stagger,
          overwrite = _this3$vars.overwrite,
          keyframes = _this3$vars.keyframes,
          defaults = _this3$vars.defaults,
          scrollTrigger = _this3$vars.scrollTrigger,
          yoyoEase = _this3$vars.yoyoEase,
          parent = _this3.parent,
          parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
          tl,
          i,
          copy,
          l,
          p,
          curTarget,
          staggerFunc,
          staggerVarsToMerge;
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
      _this3._ptLookup = [];
      _this3._overwrite = overwrite;

      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars;
        tl = _this3.timeline = new Timeline({
          data: "nested",
          defaults: defaults || {}
        });
        tl.kill();
        tl.parent = _assertThisInitialized(_this3);

        if (keyframes) {
          _setDefaults(tl.vars.defaults, {
            ease: "none"
          });

          keyframes.forEach(function (frame) {
            return tl.to(parsedTargets, frame, ">");
          });
        } else {
          l = parsedTargets.length;
          staggerFunc = stagger ? distribute(stagger) : _emptyFunc;

          if (_isObject(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                staggerVarsToMerge || (staggerVarsToMerge = {});
                staggerVarsToMerge[p] = stagger[p];
              }
            }
          }

          for (i = 0; i < l; i++) {
            copy = {};

            for (p in vars) {
              if (_staggerPropsToSkip.indexOf(p) < 0) {
                copy[p] = vars[p];
              }
            }

            copy.stagger = 0;
            yoyoEase && (copy.yoyoEase = yoyoEase);
            staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
            curTarget = parsedTargets[i];
            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

            if (!stagger && l === 1 && copy.delay) {
              _this3._delay = delay = copy.delay;
              _this3._start += delay;
              copy.delay = 0;
            }

            tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
          }

          tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
        }

        duration || _this3.duration(duration = tl.duration());
      } else {
        _this3.timeline = 0;
      }

      if (overwrite === true) {
        _overwritingTween = _assertThisInitialized(_this3);

        _globalTimeline.killTweensOf(parsedTargets);

        _overwritingTween = 0;
      }

      parent && _postAddChecks(parent, _assertThisInitialized(_this3));

      if (immediateRender || !duration && !keyframes && _this3._start === _round(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
        _this3._tTime = -_tinyNum;

        _this3.render(Math.max(0, -delay));
      }

      scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
      return _this3;
    }

    var _proto3 = Tween.prototype;

    _proto3.render = function render(totalTime, suppressEvents, force) {
      var prevTime = this._time,
          tDur = this._tDur,
          dur = this._dur,
          tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
          time,
          pt,
          iteration,
          cycleDuration,
          prevIteration,
          isYoyo,
          ratio,
          timeline,
          yoyoEase;

      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force);
      } else if (tTime !== this._tTime || !totalTime || force || this._startAt && this._zTime < 0 !== totalTime < 0) {
        time = tTime;
        timeline = this.timeline;

        if (this._repeat) {
          cycleDuration = dur + this._rDelay;
          time = _round(tTime % cycleDuration);

          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            iteration = ~~(tTime / cycleDuration);

            if (iteration && iteration === tTime / cycleDuration) {
              time = dur;
              iteration--;
            }

            time > dur && (time = dur);
          }

          isYoyo = this._yoyo && iteration & 1;

          if (isYoyo) {
            yoyoEase = this._yEase;
            time = dur - time;
          }

          prevIteration = _animationCycle(this._tTime, cycleDuration);

          if (time === prevTime && !force && this._initted) {
            return this;
          }

          if (iteration !== prevIteration) {
            timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);

            if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
              this._lock = force = 1;
              this.render(_round(cycleDuration * iteration), true).invalidate()._lock = 0;
            }
          }
        }

        if (!this._initted) {
          if (_attemptInitTween(this, totalTime < 0 ? totalTime : time, force, suppressEvents)) {
            this._tTime = 0;
            return this;
          }

          if (dur !== this._dur) {
            return this.render(totalTime, suppressEvents, force);
          }
        }

        this._tTime = tTime;
        this._time = time;

        if (!this._act && this._ts) {
          this._act = 1;
          this._lazy = 0;
        }

        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

        if (this._from) {
          this.ratio = ratio = 1 - ratio;
        }

        time && !prevTime && !suppressEvents && _callback(this, "onStart");
        pt = this._pt;

        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }

        timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);

        if (this._onUpdate && !suppressEvents) {
          totalTime < 0 && this._startAt && this._startAt.render(totalTime, true, force);

          _callback(this, "onUpdate");
        }

        this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
          (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);

          if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }

      return this;
    };

    _proto3.targets = function targets() {
      return this._targets;
    };

    _proto3.invalidate = function invalidate() {
      this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0;
      this._ptLookup = [];
      this.timeline && this.timeline.invalidate();
      return _Animation2.prototype.invalidate.call(this);
    };

    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = "all";
      }

      if (!targets && (!vars || vars === "all")) {
        this._lazy = 0;

        if (this.parent) {
          return _interrupt(this);
        }
      }

      if (this.timeline) {
        var tDur = this.timeline.totalDuration();
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
        this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
        return this;
      }

      var parsedTargets = this._targets,
          killingTargets = targets ? toArray(targets) : parsedTargets,
          propTweenLookup = this._ptLookup,
          firstPT = this._pt,
          overwrittenProps,
          curLookup,
          curOverwriteProps,
          props,
          p,
          pt,
          i;

      if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
        vars === "all" && (this._pt = 0);
        return _interrupt(this);
      }

      overwrittenProps = this._op = this._op || [];

      if (vars !== "all") {
        if (_isString(vars)) {
          p = {};

          _forEachName(vars, function (name) {
            return p[name] = 1;
          });

          vars = p;
        }

        vars = _addAliasesToVars(parsedTargets, vars);
      }

      i = parsedTargets.length;

      while (i--) {
        if (~killingTargets.indexOf(parsedTargets[i])) {
          curLookup = propTweenLookup[i];

          if (vars === "all") {
            overwrittenProps[i] = vars;
            props = curLookup;
            curOverwriteProps = {};
          } else {
            curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
            props = vars;
          }

          for (p in props) {
            pt = curLookup && curLookup[p];

            if (pt) {
              if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                _removeLinkedListItem(this, pt, "_pt");
              }

              delete curLookup[p];
            }

            if (curOverwriteProps !== "all") {
              curOverwriteProps[p] = 1;
            }
          }
        }
      }

      this._initted && !this._pt && firstPT && _interrupt(this);
      return this;
    };

    Tween.to = function to(targets, vars) {
      return new Tween(targets, vars, arguments[2]);
    };

    Tween.from = function from(targets, vars) {
      return new Tween(targets, _parseVars(arguments, 1));
    };

    Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
      return new Tween(callback, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay: delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope
      });
    };

    Tween.fromTo = function fromTo(targets, fromVars, toVars) {
      return new Tween(targets, _parseVars(arguments, 2));
    };

    Tween.set = function set(targets, vars) {
      vars.duration = 0;
      vars.repeatDelay || (vars.repeat = 0);
      return new Tween(targets, vars);
    };

    Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive);
    };

    return Tween;
  }(Animation);

  _setDefaults(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });

  _forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
    Tween[name] = function () {
      var tl = new Timeline(),
          params = _slice.call(arguments, 0);

      params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params);
    };
  });

  var _setterPlain = function _setterPlain(target, property, value) {
    return target[property] = value;
  },
      _setterFunc = function _setterFunc(target, property, value) {
    return target[property](value);
  },
      _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
    return target[property](data.fp, value);
  },
      _setterAttribute = function _setterAttribute(target, property, value) {
    return target.setAttribute(property, value);
  },
      _getSetter = function _getSetter(target, property) {
    return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
  },
      _renderPlain = function _renderPlain(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data);
  },
      _renderBoolean = function _renderBoolean(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  },
      _renderComplexString = function _renderComplexString(ratio, data) {
    var pt = data._pt,
        s = "";

    if (!ratio && data.b) {
      s = data.b;
    } else if (ratio === 1 && data.e) {
      s = data.e;
    } else {
      while (pt) {
        s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s;
        pt = pt._next;
      }

      s += data.c;
    }

    data.set(data.t, data.p, s, data);
  },
      _renderPropTweens = function _renderPropTweens(ratio, data) {
    var pt = data._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
  },
      _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
    var pt = this._pt,
        next;

    while (pt) {
      next = pt._next;
      pt.p === property && pt.modifier(modifier, tween, target);
      pt = next;
    }
  },
      _killPropTweensOf = function _killPropTweensOf(property) {
    var pt = this._pt,
        hasNonDependentRemaining,
        next;

    while (pt) {
      next = pt._next;

      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, "_pt");
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1;
      }

      pt = next;
    }

    return !hasNonDependentRemaining;
  },
      _setterWithModifier = function _setterWithModifier(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  },
      _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
    var pt = parent._pt,
        next,
        pt2,
        first,
        last;

    while (pt) {
      next = pt._next;
      pt2 = first;

      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next;
      }

      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt;
      } else {
        first = pt;
      }

      if (pt._next = pt2) {
        pt2._prev = pt;
      } else {
        last = pt;
      }

      pt = next;
    }

    parent._pt = first;
  };

  var PropTween = function () {
    function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target;
      this.s = start;
      this.c = change;
      this.p = prop;
      this.r = renderer || _renderPlain;
      this.d = data || this;
      this.set = setter || _setterPlain;
      this.pr = priority || 0;
      this._next = next;

      if (next) {
        next._prev = this;
      }
    }

    var _proto4 = PropTween.prototype;

    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set;
      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target;
      this.tween = tween;
    };

    return PropTween;
  }();

  _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
    return _reservedProps[name] = 1;
  });

  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults,
    autoRemoveChildren: true,
    id: "root",
    smoothChildTiming: true
  });
  _config.stringFilter = _colorStringFilter;
  var _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args.forEach(function (config) {
        return _createPlugin(config);
      });
    },
    timeline: function timeline(vars) {
      return new Timeline(vars);
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive);
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      _isString(target) && (target = toArray(target)[0]);

      var getter = _getCache(target || {}).get,
          format = unit ? _passThrough : _numericIfPossible;

      unit === "native" && (unit = "");
      return !target ? target : !property ? function (property, unit, uncache) {
        return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray(target);

      if (target.length > 1) {
        var setters = target.map(function (t) {
          return gsap.quickSetter(t, property, unit);
        }),
            l = setters.length;
        return function (value) {
          var i = l;

          while (i--) {
            setters[i](value);
          }
        };
      }

      target = target[0] || {};

      var Plugin = _plugins[property],
          cache = _getCache(target),
          p = cache.harness && (cache.harness.aliases || {})[property] || property,
          setter = Plugin ? function (value) {
        var p = new Plugin();
        _quickTween._pt = 0;
        p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
        p.render(1, p);
        _quickTween._pt && _renderPropTweens(1, _quickTween);
      } : cache.set(target, p);

      return Plugin ? setter : function (value) {
        return setter(target, p, unit ? value + unit : value, cache, 1);
      };
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, true).length > 0;
    },
    defaults: function defaults(value) {
      value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
      return _mergeDeep(_defaults, value || {});
    },
    config: function config(value) {
      return _mergeDeep(_config, value || {});
    },
    registerEffect: function registerEffect(_ref) {
      var name = _ref.name,
          effect = _ref.effect,
          plugins = _ref.plugins,
          defaults = _ref.defaults,
          extendTimeline = _ref.extendTimeline;
      (plugins || "").split(",").forEach(function (pluginName) {
        return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
      });

      _effects[name] = function (targets, vars, tl) {
        return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
      };

      if (extendTimeline) {
        Timeline.prototype[name] = function (targets, vars, position) {
          return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
        };
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease);
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id);
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {};
      }

      var tl = new Timeline(vars),
          child,
          next;
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

      _globalTimeline.remove(tl);

      tl._dp = 0;
      tl._time = tl._tTime = _globalTimeline._time;
      child = _globalTimeline._first;

      while (child) {
        next = child._next;

        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay);
        }

        child = next;
      }

      _addToTimeline(_globalTimeline, tl, 0);

      return tl;
    },
    utils: {
      wrap: wrap,
      wrapYoyo: wrapYoyo,
      distribute: distribute,
      random: random,
      snap: snap,
      normalize: normalize,
      getUnit: getUnit,
      clamp: clamp,
      splitColor: splitColor,
      toArray: toArray,
      mapRange: mapRange,
      pipe: pipe,
      unitize: unitize,
      interpolate: interpolate,
      shuffle: shuffle
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween: PropTween,
      globals: _addGlobal,
      Tween: Tween,
      Timeline: Timeline,
      Animation: Animation,
      getCache: _getCache,
      _removeLinkedListItem: _removeLinkedListItem
    }
  };

  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
    return _gsap[name] = Tween[name];
  });

  _ticker.add(Timeline.updateRoot);

  _quickTween = _gsap.to({}, {
    duration: 0
  });

  var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
    var pt = plugin._pt;

    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next;
    }

    return pt;
  },
      _addModifiers = function _addModifiers(tween, modifiers) {
    var targets = tween._targets,
        p,
        i,
        pt;

    for (p in modifiers) {
      i = targets.length;

      while (i--) {
        pt = tween._ptLookup[i][p];

        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            pt = _getPluginPropTween(pt, p);
          }

          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
        }
      }
    }
  },
      _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
    return {
      name: name,
      rawVars: 1,
      init: function init(target, vars, tween) {
        tween._onInit = function (tween) {
          var temp, p;

          if (_isString(vars)) {
            temp = {};

            _forEachName(vars, function (name) {
              return temp[name] = 1;
            });

            vars = temp;
          }

          if (modifier) {
            temp = {};

            for (p in vars) {
              temp[p] = modifier(vars[p]);
            }

            vars = temp;
          }

          _addModifiers(tween, vars);
        };
      }
    };
  };

  var gsap = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      var p, pt;

      for (p in vars) {
        pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
        pt && (pt.op = p);

        this._props.push(p);
      }
    }
  }, {
    name: "endArray",
    init: function init(target, value) {
      var i = value.length;

      while (i--) {
        this.add(target, i, target[i] || 0, value[i]);
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
  Tween.version = Timeline.version = gsap.version = "3.5.1";
  _coreReady = 1;

  if (_windowExists()) {
    _wake();
  }

  var Power0 = _easeMap.Power0,
      Power1 = _easeMap.Power1,
      Power2 = _easeMap.Power2,
      Power3 = _easeMap.Power3,
      Power4 = _easeMap.Power4,
      Linear = _easeMap.Linear,
      Quad = _easeMap.Quad,
      Cubic = _easeMap.Cubic,
      Quart = _easeMap.Quart,
      Quint = _easeMap.Quint,
      Strong = _easeMap.Strong,
      Elastic = _easeMap.Elastic,
      Back = _easeMap.Back,
      SteppedEase = _easeMap.SteppedEase,
      Bounce = _easeMap.Bounce,
      Sine = _easeMap.Sine,
      Expo = _easeMap.Expo,
      Circ = _easeMap.Circ;

  var _win$1,
      _doc$1,
      _docElement,
      _pluginInitted,
      _tempDiv,
      _tempDivStyler,
      _recentSetterPlugin,
      _windowExists$1 = function _windowExists() {
    return typeof window !== "undefined";
  },
      _transformProps = {},
      _RAD2DEG = 180 / Math.PI,
      _DEG2RAD = Math.PI / 180,
      _atan2 = Math.atan2,
      _bigNum$1 = 1e8,
      _capsExp = /([A-Z])/g,
      _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
      _complexExp = /[\s,\(]\S/,
      _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  },
      _renderCSSProp = function _renderCSSProp(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
  },
      _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
  },
      _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
    return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
  },
      _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
  },
      _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  },
      _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  },
      _setterCSSStyle = function _setterCSSStyle(target, property, value) {
    return target.style[property] = value;
  },
      _setterCSSProp = function _setterCSSProp(target, property, value) {
    return target.style.setProperty(property, value);
  },
      _setterTransform = function _setterTransform(target, property, value) {
    return target._gsap[property] = value;
  },
      _setterScale = function _setterScale(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value;
  },
      _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  },
      _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  },
      _transformProp = "transform",
      _transformOriginProp = _transformProp + "Origin",
      _supports3D,
      _createElement = function _createElement(type, ns) {
    var e = _doc$1.createElementNS ? _doc$1.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$1.createElement(type);
    return e.style ? e : _doc$1.createElement(type);
  },
      _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
    var cs = getComputedStyle(target);
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || "";
  },
      _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
      _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
    var e = element || _tempDiv,
        s = e.style,
        i = 5;

    if (property in s && !preferPrefix) {
      return property;
    }

    property = property.charAt(0).toUpperCase() + property.substr(1);

    while (i-- && !(_prefixes[i] + property in s)) {}

    return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
  },
      _initCore = function _initCore() {
    if (_windowExists$1() && window.document) {
      _win$1 = window;
      _doc$1 = _win$1.document;
      _docElement = _doc$1.documentElement;
      _tempDiv = _createElement("div") || {
        style: {}
      };
      _tempDivStyler = _createElement("div");
      _transformProp = _checkPropPrefix(_transformProp);
      _transformOriginProp = _transformProp + "Origin";
      _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
      _supports3D = !!_checkPropPrefix("perspective");
      _pluginInitted = 1;
    }
  },
      _getBBoxHack = function _getBBoxHack(swapIfPossible) {
    var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
        oldParent = this.parentNode,
        oldSibling = this.nextSibling,
        oldCSS = this.style.cssText,
        bbox;

    _docElement.appendChild(svg);

    svg.appendChild(this);
    this.style.display = "block";

    if (swapIfPossible) {
      try {
        bbox = this.getBBox();
        this._gsapBBox = this.getBBox;
        this.getBBox = _getBBoxHack;
      } catch (e) {}
    } else if (this._gsapBBox) {
      bbox = this._gsapBBox();
    }

    if (oldParent) {
      if (oldSibling) {
        oldParent.insertBefore(this, oldSibling);
      } else {
        oldParent.appendChild(this);
      }
    }

    _docElement.removeChild(svg);

    this.style.cssText = oldCSS;
    return bbox;
  },
      _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
    var i = attributesArray.length;

    while (i--) {
      if (target.hasAttribute(attributesArray[i])) {
        return target.getAttribute(attributesArray[i]);
      }
    }
  },
      _getBBox = function _getBBox(target) {
    var bounds;

    try {
      bounds = target.getBBox();
    } catch (error) {
      bounds = _getBBoxHack.call(target, true);
    }

    bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true));
    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
      y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
      width: 0,
      height: 0
    } : bounds;
  },
      _isSVG = function _isSVG(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
  },
      _removeProperty = function _removeProperty(target, property) {
    if (property) {
      var style = target.style;

      if (property in _transformProps && property !== _transformOriginProp) {
        property = _transformProp;
      }

      if (style.removeProperty) {
        if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
          property = "-" + property;
        }

        style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        style.removeAttribute(property);
      }
    }
  },
      _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
    var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
    plugin._pt = pt;
    pt.b = beginning;
    pt.e = end;

    plugin._props.push(property);

    return pt;
  },
      _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1
  },
      _convertToUnit = function _convertToUnit(target, property, value, unit) {
    var curValue = parseFloat(value) || 0,
        curUnit = (value + "").trim().substr((curValue + "").length) || "px",
        style = _tempDiv.style,
        horizontal = _horizontalExp.test(property),
        isRootSVG = target.tagName.toLowerCase() === "svg",
        measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
        amount = 100,
        toPixels = unit === "px",
        toPercent = unit === "%",
        px,
        parent,
        cache,
        isSVG;

    if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue;
    }

    curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
    isSVG = target.getCTM && _isSVG(target);

    if (toPercent && (_transformProps[property] || ~property.indexOf("adius"))) {
      return _round(curValue / (isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty]) * amount);
    }

    style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
    parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }

    if (!parent || parent === _doc$1 || !parent.appendChild) {
      parent = _doc$1.body;
    }

    cache = parent._gsap;

    if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time) {
      return _round(curValue / cache.width * amount);
    } else {
      (toPercent || curUnit === "%") && (style.position = _getComputedProperty(target, "position"));
      parent === target && (style.position = "static");
      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);
      style.position = "absolute";

      if (horizontal && toPercent) {
        cache = _getCache(parent);
        cache.time = _ticker.time;
        cache.width = parent[measureProperty];
      }
    }

    return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
  },
      _get = function _get(target, property, unit, uncache) {
    var value;
    _pluginInitted || _initCore();

    if (property in _propertyAliases && property !== "transform") {
      property = _propertyAliases[property];

      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }

    if (_transformProps[property] && property !== "transform") {
      value = _parseTransform(target, uncache);
      value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
    } else {
      value = target.style[property];

      if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
        value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
      }
    }

    return unit && !~(value + "").indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
  },
      _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
    if (!start || start === "none") {
      var p = _checkPropPrefix(prop, target, 1),
          s = p && _getComputedProperty(target, p, 1);

      if (s && s !== start) {
        prop = p;
        start = s;
      } else if (prop === "borderColor") {
        start = _getComputedProperty(target, "borderTopColor");
      }
    }

    var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString),
        index = 0,
        matchIndex = 0,
        a,
        result,
        startValues,
        startNum,
        color,
        startValue,
        endValue,
        endNum,
        chunk,
        endUnit,
        startUnit,
        relative,
        endValues;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";

    if (end === "auto") {
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      target.style[prop] = start;
    }

    a = [start, end];

    _colorStringFilter(a);

    start = a[0];
    end = a[1];
    startValues = start.match(_numWithUnitExp) || [];
    endValues = end.match(_numWithUnitExp) || [];

    if (endValues.length) {
      while (result = _numWithUnitExp.exec(end)) {
        endValue = result[0];
        chunk = end.substring(index, result.index);

        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
          color = 1;
        }

        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

          if (relative) {
            endValue = endValue.substr(2);
          }

          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _numWithUnitExp.lastIndex - endUnit.length;

          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit;

            if (index === end.length) {
              end += endUnit;
              pt.e += endUnit;
            }
          }

          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          }

          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            s: startNum,
            c: relative ? relative * endNum : endNum - startNum,
            m: color && color < 4 ? Math.round : 0
          };
        }
      }

      pt.c = index < end.length ? end.substring(index, end.length) : "";
    } else {
      pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
    }

    if (_relExp.test(end)) {
      pt.e = 0;
    }

    this._pt = pt;
    return pt;
  },
      _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  },
      _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
    var split = value.split(" "),
        x = split[0],
        y = split[1] || "50%";

    if (x === "top" || x === "bottom" || y === "left" || y === "right") {
      value = x;
      x = y;
      y = value;
    }

    split[0] = _keywordToPercent[x] || x;
    split[1] = _keywordToPercent[y] || y;
    return split.join(" ");
  },
      _renderClearProps = function _renderClearProps(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t,
          style = target.style,
          props = data.u,
          cache = target._gsap,
          prop,
          clearTransforms,
          i;

      if (props === "all" || props === true) {
        style.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i = props.length;

        while (--i > -1) {
          prop = props[i];

          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
          }

          _removeProperty(target, prop);
        }
      }

      if (clearTransforms) {
        _removeProperty(target, _transformProp);

        if (cache) {
          cache.svg && target.removeAttribute("transform");

          _parseTransform(target, 1);

          cache.uncache = 1;
        }
      }
    }
  },
      _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
        pt.u = endValue;
        pt.pr = -10;
        pt.tween = tween;

        plugin._props.push(property);

        return 1;
      }
    }
  },
      _identity2DMatrix = [1, 0, 0, 1, 0, 0],
      _rotationalProperties = {},
      _isNullTransform = function _isNullTransform(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  },
      _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
    var matrixString = _getComputedProperty(target, _transformProp);

    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
  },
      _getMatrix = function _getMatrix(target, force2D) {
    var cache = target._gsap || _getCache(target),
        style = target.style,
        matrix = _getComputedTransformMatrixAsArray(target),
        parent,
        nextSibling,
        temp,
        addedToDOM;

    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix;
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
      temp = style.display;
      style.display = "block";
      parent = target.parentNode;

      if (!parent || !target.offsetParent) {
        addedToDOM = 1;
        nextSibling = target.nextSibling;

        _docElement.appendChild(target);
      }

      matrix = _getComputedTransformMatrixAsArray(target);
      temp ? style.display = temp : _removeProperty(target, "display");

      if (addedToDOM) {
        nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
      }
    }

    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
  },
      _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    var cache = target._gsap,
        matrix = matrixArray || _getMatrix(target, true),
        xOriginOld = cache.xOrigin || 0,
        yOriginOld = cache.yOrigin || 0,
        xOffsetOld = cache.xOffset || 0,
        yOffsetOld = cache.yOffset || 0,
        a = matrix[0],
        b = matrix[1],
        c = matrix[2],
        d = matrix[3],
        tx = matrix[4],
        ty = matrix[5],
        originSplit = origin.split(" "),
        xOrigin = parseFloat(originSplit[0]) || 0,
        yOrigin = parseFloat(originSplit[1]) || 0,
        bounds,
        determinant,
        x,
        y;

    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
    } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
      x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
      y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
      xOrigin = x;
      yOrigin = y;
    }

    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }

    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp] = "0px 0px";

    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
    }

    target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
  },
      _parseTransform = function _parseTransform(target, uncache) {
    var cache = target._gsap || new GSCache(target);

    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }

    var style = target.style,
        invertedScaleX = cache.scaleX < 0,
        px = "px",
        deg = "deg",
        origin = _getComputedProperty(target, _transformOriginProp) || "0",
        x,
        y,
        z,
        scaleX,
        scaleY,
        rotation,
        rotationX,
        rotationY,
        skewX,
        skewY,
        perspective,
        xOrigin,
        yOrigin,
        matrix,
        angle,
        cos,
        sin,
        a,
        b,
        c,
        d,
        a12,
        a22,
        t1,
        t2,
        t3,
        a13,
        a23,
        a33,
        a42,
        a43,
        a32;
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    matrix = _getMatrix(target, cache.svg);

    if (cache.svg) {
      t1 = !cache.uncache && target.getAttribute("data-svg-origin");

      _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
    }

    xOrigin = cache.xOrigin || 0;
    yOrigin = cache.yOrigin || 0;

    if (matrix !== _identity2DMatrix) {
      a = matrix[0];
      b = matrix[1];
      c = matrix[2];
      d = matrix[3];
      x = a12 = matrix[4];
      y = a22 = matrix[5];

      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b);
        scaleY = Math.sqrt(d * d + c * c);
        rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
        skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
        skewX && (scaleY *= Math.cos(skewX * _DEG2RAD));

        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c);
          y -= yOrigin - (xOrigin * b + yOrigin * d);
        }
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x = matrix[12];
        y = matrix[13];
        z = matrix[14];
        angle = _atan2(a32, a33);
        rotationX = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        }

        angle = _atan2(-c, a33);
        rotationY = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a * cos - a13 * sin;
          t2 = b * cos - a23 * sin;
          t3 = c * cos - a33 * sin;
          a43 = d * sin + a43 * cos;
          a = t1;
          b = t2;
          c = t3;
        }

        angle = _atan2(b, a);
        rotation = angle * _RAD2DEG;

        if (angle) {
          cos = Math.cos(angle);
          sin = Math.sin(angle);
          t1 = a * cos + b * sin;
          t2 = a12 * cos + a22 * sin;
          b = b * cos - a * sin;
          a22 = a22 * cos - a12 * sin;
          a = t1;
          a12 = t2;
        }

        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }

        scaleX = _round(Math.sqrt(a * a + b * b + c * c));
        scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
        angle = _atan2(a12, a22);
        skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }

      if (cache.svg) {
        t1 = target.getAttribute("transform");
        cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
        t1 && target.setAttribute("transform", t1);
      }
    }

    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }

    cache.x = ((cache.xPercent = x && Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0) ? 0 : x) + px;
    cache.y = ((cache.yPercent = y && Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0) ? 0 : y) + px;
    cache.z = z + px;
    cache.scaleX = _round(scaleX);
    cache.scaleY = _round(scaleY);
    cache.rotation = _round(rotation) + deg;
    cache.rotationX = _round(rotationX) + deg;
    cache.rotationY = _round(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective + px;

    if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
      style[_transformOriginProp] = _firstTwoOnly(origin);
    }

    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _config.force3D;
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  },
      _firstTwoOnly = function _firstTwoOnly(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  },
      _addPxTranslate = function _addPxTranslate(target, start, value) {
    var unit = getUnit(start);
    return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
  },
      _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;

    _renderCSSTransforms(ratio, cache);
  },
      _zeroDeg = "0deg",
      _zeroPx = "0px",
      _endParenthesis = ") ",
      _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
    var _ref = cache || this,
        xPercent = _ref.xPercent,
        yPercent = _ref.yPercent,
        x = _ref.x,
        y = _ref.y,
        z = _ref.z,
        rotation = _ref.rotation,
        rotationY = _ref.rotationY,
        rotationX = _ref.rotationX,
        skewX = _ref.skewX,
        skewY = _ref.skewY,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        transformPerspective = _ref.transformPerspective,
        force3D = _ref.force3D,
        target = _ref.target,
        zOrigin = _ref.zOrigin,
        transforms = "",
        use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;

    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle = parseFloat(rotationY) * _DEG2RAD,
          a13 = Math.sin(angle),
          a33 = Math.cos(angle),
          cos;

      angle = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle);
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
      y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
    }

    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }

    if (xPercent || yPercent) {
      transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
    }

    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
    }

    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }

    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }

    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }

    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }

    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }

    target.style[_transformProp] = transforms || "translate(0, 0)";
  },
      _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
    var _ref2 = cache || this,
        xPercent = _ref2.xPercent,
        yPercent = _ref2.yPercent,
        x = _ref2.x,
        y = _ref2.y,
        rotation = _ref2.rotation,
        skewX = _ref2.skewX,
        skewY = _ref2.skewY,
        scaleX = _ref2.scaleX,
        scaleY = _ref2.scaleY,
        target = _ref2.target,
        xOrigin = _ref2.xOrigin,
        yOrigin = _ref2.yOrigin,
        xOffset = _ref2.xOffset,
        yOffset = _ref2.yOffset,
        forceCSS = _ref2.forceCSS,
        tx = parseFloat(x),
        ty = parseFloat(y),
        a11,
        a21,
        a12,
        a22,
        temp;

    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);

    if (skewY) {
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }

    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;

      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;

        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }

      a11 = _round(a11);
      a21 = _round(a21);
      a12 = _round(a12);
      a22 = _round(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }

    if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
      tx = _convertToUnit(target, "x", x, "px");
      ty = _convertToUnit(target, "y", y, "px");
    }

    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }

    if (xPercent || yPercent) {
      temp = target.getBBox();
      tx = _round(tx + xPercent / 100 * temp.width);
      ty = _round(ty + yPercent / 100 * temp.height);
    }

    temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
    target.setAttribute("transform", temp);

    if (forceCSS) {
      target.style[_transformProp] = temp;
    }
  },
      _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
    var cap = 360,
        isString = _isString(endValue),
        endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
        change = relative ? endNum * relative : endNum - startNum,
        finalValue = startNum + change + "deg",
        direction,
        pt;

    if (isString) {
      direction = endValue.split("_")[1];

      if (direction === "short") {
        change %= cap;

        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }

      if (direction === "cw" && change < 0) {
        change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      }
    }

    plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
    pt.e = finalValue;
    pt.u = "deg";

    plugin._props.push(property);

    return pt;
  },
      _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
    var style = _tempDivStyler.style,
        startCache = target._gsap,
        exclude = "perspective,force3D,transformOrigin,svgOrigin",
        endCache,
        p,
        startValue,
        endValue,
        startNum,
        endNum,
        startUnit,
        endUnit;
    style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;";
    style[_transformProp] = transforms;

    _doc$1.body.appendChild(_tempDivStyler);

    endCache = _parseTransform(_tempDivStyler, 1);

    for (p in _transformProps) {
      startValue = startCache[p];
      endValue = endCache[p];

      if (startValue !== endValue && exclude.indexOf(p) < 0) {
        startUnit = getUnit(startValue);
        endUnit = getUnit(endValue);
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
        plugin._pt.u = endUnit || 0;

        plugin._props.push(p);
      }
    }

    _doc$1.body.removeChild(_tempDivStyler);
  };

  _forEachName("padding,margin,Width,Radius", function (name, index) {
    var t = "Top",
        r = "Right",
        b = "Bottom",
        l = "Left",
        props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
      return index < 2 ? name + side : "border" + side + name;
    });

    _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
      var a, vars;

      if (arguments.length < 4) {
        a = props.map(function (prop) {
          return _get(plugin, prop, property);
        });
        vars = a.join(" ");
        return vars.split(a[0]).length === 5 ? a[0] : vars;
      }

      a = (endValue + "").split(" ");
      vars = {};
      props.forEach(function (prop, i) {
        return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
      });
      plugin.init(target, vars, tween);
    };
  });

  var CSSPlugin = {
    name: "css",
    register: _initCore,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType;
    },
    init: function init(target, vars, tween, index, targets) {
      var props = this._props,
          style = target.style,
          startValue,
          endValue,
          endNum,
          startNum,
          type,
          specialProp,
          p,
          startUnit,
          endUnit,
          relative,
          isTransformRelated,
          transformPropTween,
          cache,
          smooth,
          hasPriority;
      _pluginInitted || _initCore();

      for (p in vars) {
        if (p === "autoRound") {
          continue;
        }

        endValue = vars[p];

        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue;
        }

        type = typeof endValue;
        specialProp = _specialProps[p];

        if (type === "function") {
          endValue = endValue.call(tween, index, target, targets);
          type = typeof endValue;
        }

        if (type === "string" && ~endValue.indexOf("random(")) {
          endValue = _replaceRandom(endValue);
        }

        if (specialProp) {
          if (specialProp(this, target, p, endValue, tween)) {
            hasPriority = 1;
          }
        } else if (p.substr(0, 2) === "--") {
          this.add(style, "setProperty", getComputedStyle(target).getPropertyValue(p) + "", endValue + "", index, targets, 0, 0, p);
        } else if (type !== "undefined") {
          startValue = _get(target, p);
          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

          if (relative) {
            endValue = endValue.substr(2);
          }

          endNum = parseFloat(endValue);

          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                startNum = 0;
              }

              _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
            }

            if (p !== "scale" && p !== "transform") {
              p = _propertyAliases[p];
              ~p.indexOf(",") && (p = p.split(",")[0]);
            }
          }

          isTransformRelated = p in _transformProps;

          if (isTransformRelated) {
            if (!transformPropTween) {
              cache = target._gsap;
              cache.renderTransform || _parseTransform(target);
              smooth = vars.smoothOrigin !== false && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
              transformPropTween.dep = 1;
            }

            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
              props.push("scaleY", p);
              p += "X";
            } else if (p === "transformOrigin") {
              endValue = _convertKeywordsToPercentages(endValue);

              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this);
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);

                _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
              }

              continue;
            } else if (p === "svgOrigin") {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this);

              continue;
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, endValue, relative);

              continue;
            } else if (p === "smoothOrigin") {
              _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

              continue;
            } else if (p === "force3D") {
              cache[p] = endValue;
              continue;
            } else if (p === "transform") {
              _addRawTransformPTs(this, endValue, target);

              continue;
            }
          } else if (!(p in style)) {
            p = _checkPropPrefix(p) || p;
          }

          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
            startUnit = (startValue + "").substr((startNum + "").length);
            endNum || (endNum = 0);
            endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
            startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, endUnit === "px" && vars.autoRound !== false && !isTransformRelated ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;

            if (startUnit !== endUnit) {
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning;
            }
          } else if (!(p in style)) {
            if (p in target) {
              this.add(target, p, target[p], endValue, index, targets);
            } else {
              _missingPlugin(p, endValue);

              continue;
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, endValue);
          }

          props.push(p);
        }
      }

      hasPriority && _sortPropTweensByPriority(this);
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      var p = _propertyAliases[property];
      p && p.indexOf(",") < 0 && (property = p);
      return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
    },
    core: {
      _removeProperty: _removeProperty,
      _getMatrix: _getMatrix
    }
  };
  gsap.utils.checkPrefix = _checkPropPrefix;

  (function (positionAndScale, rotation, others, aliases) {
    var all = _forEachName(positionAndScale + "," + rotation + "," + others, function (name) {
      _transformProps[name] = 1;
    });

    _forEachName(rotation, function (name) {
      _config.units[name] = "deg";
      _rotationalProperties[name] = 1;
    });

    _propertyAliases[all[13]] = positionAndScale + "," + rotation;

    _forEachName(aliases, function (name) {
      var split = name.split(":");
      _propertyAliases[split[1]] = all[split[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");

  _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
    _config.units[name] = "px";
  });

  gsap.registerPlugin(CSSPlugin);

  var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap,
      TweenMaxWithCSS = gsapWithCSS.core.Tween;

  exports.Back = Back;
  exports.Bounce = Bounce;
  exports.CSSPlugin = CSSPlugin;
  exports.Circ = Circ;
  exports.Cubic = Cubic;
  exports.Elastic = Elastic;
  exports.Expo = Expo;
  exports.Linear = Linear;
  exports.Power0 = Power0;
  exports.Power1 = Power1;
  exports.Power2 = Power2;
  exports.Power3 = Power3;
  exports.Power4 = Power4;
  exports.Quad = Quad;
  exports.Quart = Quart;
  exports.Quint = Quint;
  exports.Sine = Sine;
  exports.SteppedEase = SteppedEase;
  exports.Strong = Strong;
  exports.TimelineLite = Timeline;
  exports.TimelineMax = Timeline;
  exports.TweenLite = Tween;
  exports.TweenMax = TweenMaxWithCSS;
  exports.default = gsapWithCSS;
  exports.gsap = gsapWithCSS;

  if (typeof(window) === 'undefined' || window !== exports) {Object.defineProperty(exports, '__esModule', { value: true });} else {delete window.default;}

})));

/**
  @license
                                 Apache License
                         Version 2.0, January 2004
                      http://www.apache.org/licenses/

 TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

 1. Definitions.

    "License" shall mean the terms and conditions for use, reproduction,
    and distribution as defined by Sections 1 through 9 of this document.

    "Licensor" shall mean the copyright owner or entity authorized by
    the copyright owner that is granting the License.

    "Legal Entity" shall mean the union of the acting entity and all
    other entities that control, are controlled by, or are under common
    control with that entity. For the purposes of this definition,
    "control" means (i) the power, direct or indirect, to cause the
    direction or management of such entity, whether by contract or
    otherwise, or (ii) ownership of fifty percent (50%) or more of the
    outstanding shares, or (iii) beneficial ownership of such entity.

    "You" (or "Your") shall mean an individual or Legal Entity
    exercising permissions granted by this License.

    "Source" form shall mean the preferred form for making modifications,
    including but not limited to software source code, documentation
    source, and configuration files.

    "Object" form shall mean any form resulting from mechanical
    transformation or translation of a Source form, including but
    not limited to compiled object code, generated documentation,
    and conversions to other media types.

    "Work" shall mean the work of authorship, whether in Source or
    Object form, made available under the License, as indicated by a
    copyright notice that is included in or attached to the work
    (an example is provided in the Appendix below).

    "Derivative Works" shall mean any work, whether in Source or Object
    form, that is based on (or derived from) the Work and for which the
    editorial revisions, annotations, elaborations, or other modifications
    represent, as a whole, an original work of authorship. For the purposes
    of this License, Derivative Works shall not include works that remain
    separable from, or merely link (or bind by name) to the interfaces of,
    the Work and Derivative Works thereof.

    "Contribution" shall mean any work of authorship, including
    the original version of the Work and any modifications or additions
    to that Work or Derivative Works thereof, that is intentionally
    submitted to Licensor for inclusion in the Work by the copyright owner
    or by an individual or Legal Entity authorized to submit on behalf of
    the copyright owner. For the purposes of this definition, "submitted"
    means any form of electronic, verbal, or written communication sent
    to the Licensor or its representatives, including but not limited to
    communication on electronic mailing lists, source code control systems,
    and issue tracking systems that are managed by, or on behalf of, the
    Licensor for the purpose of discussing and improving the Work, but
    excluding communication that is conspicuously marked or otherwise
    designated in writing by the copyright owner as "Not a Contribution."

    "Contributor" shall mean Licensor and any individual or Legal Entity
    on behalf of whom a Contribution has been received by Licensor and
    subsequently incorporated within the Work.

 2. Grant of Copyright License. Subject to the terms and conditions of
    this License, each Contributor hereby grants to You a perpetual,
    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
    copyright license to reproduce, prepare Derivative Works of,
    publicly display, publicly perform, sublicense, and distribute the
    Work and such Derivative Works in Source or Object form.

 3. Grant of Patent License. Subject to the terms and conditions of
    this License, each Contributor hereby grants to You a perpetual,
    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
    (except as stated in this section) patent license to make, have made,
    use, offer to sell, sell, import, and otherwise transfer the Work,
    where such license applies only to those patent claims licensable
    by such Contributor that are necessarily infringed by their
    Contribution(s) alone or by combination of their Contribution(s)
    with the Work to which such Contribution(s) was submitted. If You
    institute patent litigation against any entity (including a
    cross-claim or counterclaim in a lawsuit) alleging that the Work
    or a Contribution incorporated within the Work constitutes direct
    or contributory patent infringement, then any patent licenses
    granted to You under this License for that Work shall terminate
    as of the date such litigation is filed.

 4. Redistribution. You may reproduce and distribute copies of the
    Work or Derivative Works thereof in any medium, with or without
    modifications, and in Source or Object form, provided that You
    meet the following conditions:

    (a) You must give any other recipients of the Work or
        Derivative Works a copy of this License; and

    (b) You must cause any modified files to carry prominent notices
        stating that You changed the files; and

    (c) You must retain, in the Source form of any Derivative Works
        that You distribute, all copyright, patent, trademark, and
        attribution notices from the Source form of the Work,
        excluding those notices that do not pertain to any part of
        the Derivative Works; and

    (d) If the Work includes a "NOTICE" text file as part of its
        distribution, then any Derivative Works that You distribute must
        include a readable copy of the attribution notices contained
        within such NOTICE file, excluding those notices that do not
        pertain to any part of the Derivative Works, in at least one
        of the following places: within a NOTICE text file distributed
        as part of the Derivative Works; within the Source form or
        documentation, if provided along with the Derivative Works; or,
        within a display generated by the Derivative Works, if and
        wherever such third-party notices normally appear. The contents
        of the NOTICE file are for informational purposes only and
        do not modify the License. You may add Your own attribution
        notices within Derivative Works that You distribute, alongside
        or as an addendum to the NOTICE text from the Work, provided
        that such additional attribution notices cannot be construed
        as modifying the License.

    You may add Your own copyright statement to Your modifications and
    may provide additional or different license terms and conditions
    for use, reproduction, or distribution of Your modifications, or
    for any such Derivative Works as a whole, provided Your use,
    reproduction, and distribution of the Work otherwise complies with
    the conditions stated in this License.

 5. Submission of Contributions. Unless You explicitly state otherwise,
    any Contribution intentionally submitted for inclusion in the Work
    by You to the Licensor shall be under the terms and conditions of
    this License, without any additional terms or conditions.
    Notwithstanding the above, nothing herein shall supersede or modify
    the terms of any separate license agreement you may have executed
    with Licensor regarding such Contributions.

 6. Trademarks. This License does not grant permission to use the trade
    names, trademarks, service marks, or product names of the Licensor,
    except as required for reasonable and customary use in describing the
    origin of the Work and reproducing the content of the NOTICE file.

 7. Disclaimer of Warranty. Unless required by applicable law or
    agreed to in writing, Licensor provides the Work (and each
    Contributor provides its Contributions) on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
    implied, including, without limitation, any warranties or conditions
    of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
    PARTICULAR PURPOSE. You are solely responsible for determining the
    appropriateness of using or redistributing the Work and assume any
    risks associated with Your exercise of permissions under this License.

 8. Limitation of Liability. In no event and under no legal theory,
    whether in tort (including negligence), contract, or otherwise,
    unless required by applicable law (such as deliberate and grossly
    negligent acts) or agreed to in writing, shall any Contributor be
    liable to You for damages, including any direct, indirect, special,
    incidental, or consequential damages of any character arising as a
    result of this License or out of the use or inability to use the
    Work (including but not limited to damages for loss of goodwill,
    work stoppage, computer failure or malfunction, or any and all
    other commercial damages or losses), even if such Contributor
    has been advised of the possibility of such damages.

 9. Accepting Warranty or Additional Liability. While redistributing
    the Work or Derivative Works thereof, You may choose to offer,
    and charge a fee for, acceptance of support, warranty, indemnity,
    or other liability obligations and/or rights consistent with this
    License. However, in accepting such obligations, You may act only
    on Your own behalf and on Your sole responsibility, not on behalf
    of any other Contributor, and only if You agree to indemnify,
    defend, and hold each Contributor harmless for any liability
    incurred by, or claims asserted against, such Contributor by reason
    of your accepting any such warranty or additional liability.

 END OF TERMS AND CONDITIONS

 APPENDIX: How to apply the Apache License to your work.

    To apply the Apache License to your work, attach the following
    boilerplate notice, with the fields enclosed by brackets "[]"
    replaced with your own identifying information. (Don't include
    the brackets!)  The text should be enclosed in the appropriate
    comment syntax for the file format. We also recommend that a
    file or class name and description of purpose be included on the
    same "printed page" as the copyright notice for easier
    identification within third-party archives.

 Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 

 **/
/**
  @license
                                 Apache License
                         Version 2.0, January 2004
                      http://www.apache.org/licenses/

 TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

 1. Definitions.

    "License" shall mean the terms and conditions for use, reproduction,
    and distribution as defined by Sections 1 through 9 of this document.

    "Licensor" shall mean the copyright owner or entity authorized by
    the copyright owner that is granting the License.

    "Legal Entity" shall mean the union of the acting entity and all
    other entities that control, are controlled by, or are under common
    control with that entity. For the purposes of this definition,
    "control" means (i) the power, direct or indirect, to cause the
    direction or management of such entity, whether by contract or
    otherwise, or (ii) ownership of fifty percent (50%) or more of the
    outstanding shares, or (iii) beneficial ownership of such entity.

    "You" (or "Your") shall mean an individual or Legal Entity
    exercising permissions granted by this License.

    "Source" form shall mean the preferred form for making modifications,
    including but not limited to software source code, documentation
    source, and configuration files.

    "Object" form shall mean any form resulting from mechanical
    transformation or translation of a Source form, including but
    not limited to compiled object code, generated documentation,
    and conversions to other media types.

    "Work" shall mean the work of authorship, whether in Source or
    Object form, made available under the License, as indicated by a
    copyright notice that is included in or attached to the work
    (an example is provided in the Appendix below).

    "Derivative Works" shall mean any work, whether in Source or Object
    form, that is based on (or derived from) the Work and for which the
    editorial revisions, annotations, elaborations, or other modifications
    represent, as a whole, an original work of authorship. For the purposes
    of this License, Derivative Works shall not include works that remain
    separable from, or merely link (or bind by name) to the interfaces of,
    the Work and Derivative Works thereof.

    "Contribution" shall mean any work of authorship, including
    the original version of the Work and any modifications or additions
    to that Work or Derivative Works thereof, that is intentionally
    submitted to Licensor for inclusion in the Work by the copyright owner
    or by an individual or Legal Entity authorized to submit on behalf of
    the copyright owner. For the purposes of this definition, "submitted"
    means any form of electronic, verbal, or written communication sent
    to the Licensor or its representatives, including but not limited to
    communication on electronic mailing lists, source code control systems,
    and issue tracking systems that are managed by, or on behalf of, the
    Licensor for the purpose of discussing and improving the Work, but
    excluding communication that is conspicuously marked or otherwise
    designated in writing by the copyright owner as "Not a Contribution."

    "Contributor" shall mean Licensor and any individual or Legal Entity
    on behalf of whom a Contribution has been received by Licensor and
    subsequently incorporated within the Work.

 2. Grant of Copyright License. Subject to the terms and conditions of
    this License, each Contributor hereby grants to You a perpetual,
    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
    copyright license to reproduce, prepare Derivative Works of,
    publicly display, publicly perform, sublicense, and distribute the
    Work and such Derivative Works in Source or Object form.

 3. Grant of Patent License. Subject to the terms and conditions of
    this License, each Contributor hereby grants to You a perpetual,
    worldwide, non-exclusive, no-charge, royalty-free, irrevocable
    (except as stated in this section) patent license to make, have made,
    use, offer to sell, sell, import, and otherwise transfer the Work,
    where such license applies only to those patent claims licensable
    by such Contributor that are necessarily infringed by their
    Contribution(s) alone or by combination of their Contribution(s)
    with the Work to which such Contribution(s) was submitted. If You
    institute patent litigation against any entity (including a
    cross-claim or counterclaim in a lawsuit) alleging that the Work
    or a Contribution incorporated within the Work constitutes direct
    or contributory patent infringement, then any patent licenses
    granted to You under this License for that Work shall terminate
    as of the date such litigation is filed.

 4. Redistribution. You may reproduce and distribute copies of the
    Work or Derivative Works thereof in any medium, with or without
    modifications, and in Source or Object form, provided that You
    meet the following conditions:

    (a) You must give any other recipients of the Work or
        Derivative Works a copy of this License; and

    (b) You must cause any modified files to carry prominent notices
        stating that You changed the files; and

    (c) You must retain, in the Source form of any Derivative Works
        that You distribute, all copyright, patent, trademark, and
        attribution notices from the Source form of the Work,
        excluding those notices that do not pertain to any part of
        the Derivative Works; and

    (d) If the Work includes a "NOTICE" text file as part of its
        distribution, then any Derivative Works that You distribute must
        include a readable copy of the attribution notices contained
        within such NOTICE file, excluding those notices that do not
        pertain to any part of the Derivative Works, in at least one
        of the following places: within a NOTICE text file distributed
        as part of the Derivative Works; within the Source form or
        documentation, if provided along with the Derivative Works; or,
        within a display generated by the Derivative Works, if and
        wherever such third-party notices normally appear. The contents
        of the NOTICE file are for informational purposes only and
        do not modify the License. You may add Your own attribution
        notices within Derivative Works that You distribute, alongside
        or as an addendum to the NOTICE text from the Work, provided
        that such additional attribution notices cannot be construed
        as modifying the License.

    You may add Your own copyright statement to Your modifications and
    may provide additional or different license terms and conditions
    for use, reproduction, or distribution of Your modifications, or
    for any such Derivative Works as a whole, provided Your use,
    reproduction, and distribution of the Work otherwise complies with
    the conditions stated in this License.

 5. Submission of Contributions. Unless You explicitly state otherwise,
    any Contribution intentionally submitted for inclusion in the Work
    by You to the Licensor shall be under the terms and conditions of
    this License, without any additional terms or conditions.
    Notwithstanding the above, nothing herein shall supersede or modify
    the terms of any separate license agreement you may have executed
    with Licensor regarding such Contributions.

 6. Trademarks. This License does not grant permission to use the trade
    names, trademarks, service marks, or product names of the Licensor,
    except as required for reasonable and customary use in describing the
    origin of the Work and reproducing the content of the NOTICE file.

 7. Disclaimer of Warranty. Unless required by applicable law or
    agreed to in writing, Licensor provides the Work (and each
    Contributor provides its Contributions) on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
    implied, including, without limitation, any warranties or conditions
    of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
    PARTICULAR PURPOSE. You are solely responsible for determining the
    appropriateness of using or redistributing the Work and assume any
    risks associated with Your exercise of permissions under this License.

 8. Limitation of Liability. In no event and under no legal theory,
    whether in tort (including negligence), contract, or otherwise,
    unless required by applicable law (such as deliberate and grossly
    negligent acts) or agreed to in writing, shall any Contributor be
    liable to You for damages, including any direct, indirect, special,
    incidental, or consequential damages of any character arising as a
    result of this License or out of the use or inability to use the
    Work (including but not limited to damages for loss of goodwill,
    work stoppage, computer failure or malfunction, or any and all
    other commercial damages or losses), even if such Contributor
    has been advised of the possibility of such damages.

 9. Accepting Warranty or Additional Liability. While redistributing
    the Work or Derivative Works thereof, You may choose to offer,
    and charge a fee for, acceptance of support, warranty, indemnity,
    or other liability obligations and/or rights consistent with this
    License. However, in accepting such obligations, You may act only
    on Your own behalf and on Your sole responsibility, not on behalf
    of any other Contributor, and only if You agree to indemnify,
    defend, and hold each Contributor harmless for any liability
    incurred by, or claims asserted against, such Contributor by reason
    of your accepting any such warranty or additional liability.

 END OF TERMS AND CONDITIONS

 APPENDIX: How to apply the Apache License to your work.

    To apply the Apache License to your work, attach the following
    boilerplate notice, with the fields enclosed by brackets "[]"
    replaced with your own identifying information. (Don't include
    the brackets!)  The text should be enclosed in the appropriate
    comment syntax for the file format. We also recommend that a
    file or class name and description of purpose be included on the
    same "printed page" as the copyright notice for easier
    identification within third-party archives.

 Copyright (c) 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 

 **/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('rxjs', ['exports'], factory) :
    (factory((global.rxjs = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
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
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    function isFunction(x) {
        return typeof x === 'function';
    }

    var _enable_super_gross_mode_that_will_cause_bad_things = false;
    var config = {
        Promise: undefined,
        set useDeprecatedSynchronousErrorHandling(value) {
            if (value) {
                var error = new Error();
                console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
            }
            else if (_enable_super_gross_mode_that_will_cause_bad_things) {
                console.log('RxJS: Back to a better error behavior. Thank you. <3');
            }
            _enable_super_gross_mode_that_will_cause_bad_things = value;
        },
        get useDeprecatedSynchronousErrorHandling() {
            return _enable_super_gross_mode_that_will_cause_bad_things;
        },
    };

    function hostReportError(err) {
        setTimeout(function () { throw err; }, 0);
    }

    var empty = {
        closed: true,
        next: function (value) { },
        error: function (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        },
        complete: function () { }
    };

    var isArray = (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

    function isObject(x) {
        return x !== null && typeof x === 'object';
    }

    var UnsubscriptionErrorImpl = (function () {
        function UnsubscriptionErrorImpl(errors) {
            Error.call(this);
            this.message = errors ?
                errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
            this.name = 'UnsubscriptionError';
            this.errors = errors;
            return this;
        }
        UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
        return UnsubscriptionErrorImpl;
    })();
    var UnsubscriptionError = UnsubscriptionErrorImpl;

    var Subscription = (function () {
        function Subscription(unsubscribe) {
            this.closed = false;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (unsubscribe) {
                this._ctorUnsubscribe = true;
                this._unsubscribe = unsubscribe;
            }
        }
        Subscription.prototype.unsubscribe = function () {
            var errors;
            if (this.closed) {
                return;
            }
            var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
            this.closed = true;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (_parentOrParents instanceof Subscription) {
                _parentOrParents.remove(this);
            }
            else if (_parentOrParents !== null) {
                for (var index = 0; index < _parentOrParents.length; ++index) {
                    var parent_1 = _parentOrParents[index];
                    parent_1.remove(this);
                }
            }
            if (isFunction(_unsubscribe)) {
                if (_ctorUnsubscribe) {
                    this._unsubscribe = undefined;
                }
                try {
                    _unsubscribe.call(this);
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
                }
            }
            if (isArray(_subscriptions)) {
                var index = -1;
                var len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject(sub)) {
                        try {
                            sub.unsubscribe();
                        }
                        catch (e) {
                            errors = errors || [];
                            if (e instanceof UnsubscriptionError) {
                                errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                            }
                            else {
                                errors.push(e);
                            }
                        }
                    }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        };
        Subscription.prototype.add = function (teardown) {
            var subscription = teardown;
            if (!teardown) {
                return Subscription.EMPTY;
            }
            switch (typeof teardown) {
                case 'function':
                    subscription = new Subscription(teardown);
                case 'object':
                    if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                        return subscription;
                    }
                    else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    }
                    else if (!(subscription instanceof Subscription)) {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                    break;
                default: {
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
                }
            }
            var _parentOrParents = subscription._parentOrParents;
            if (_parentOrParents === null) {
                subscription._parentOrParents = this;
            }
            else if (_parentOrParents instanceof Subscription) {
                if (_parentOrParents === this) {
                    return subscription;
                }
                subscription._parentOrParents = [_parentOrParents, this];
            }
            else if (_parentOrParents.indexOf(this) === -1) {
                _parentOrParents.push(this);
            }
            else {
                return subscription;
            }
            var subscriptions = this._subscriptions;
            if (subscriptions === null) {
                this._subscriptions = [subscription];
            }
            else {
                subscriptions.push(subscription);
            }
            return subscription;
        };
        Subscription.prototype.remove = function (subscription) {
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.EMPTY = (function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription()));
        return Subscription;
    }());
    function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
    }

    var rxSubscriber = (function () {
        return typeof Symbol === 'function'
            ? Symbol('rxSubscriber')
            : '@@rxSubscriber_' + Math.random();
    })();

    var Subscriber = (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destinationOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this.syncErrorValue = null;
            _this.syncErrorThrown = false;
            _this.syncErrorThrowable = false;
            _this.isStopped = false;
            switch (arguments.length) {
                case 0:
                    _this.destination = empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        _this.destination = empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (destinationOrNext instanceof Subscriber) {
                            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                            _this.destination = destinationOrNext;
                            destinationOrNext.add(_this);
                        }
                        else {
                            _this.syncErrorThrowable = true;
                            _this.destination = new SafeSubscriber(_this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    _this.syncErrorThrowable = true;
                    _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                    break;
            }
            return _this;
        }
        Subscriber.prototype[rxSubscriber] = function () { return this; };
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        Subscriber.prototype._unsubscribeAndRecycle = function () {
            var _parentOrParents = this._parentOrParents;
            this._parentOrParents = null;
            this.unsubscribe();
            this.closed = false;
            this.isStopped = false;
            this._parentOrParents = _parentOrParents;
            return this;
        };
        return Subscriber;
    }(Subscription));
    var SafeSubscriber = (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this._parentSubscriber = _parentSubscriber;
            var next;
            var context = _this;
            if (isFunction(observerOrNext)) {
                next = observerOrNext;
            }
            else if (observerOrNext) {
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (observerOrNext !== empty) {
                    context = Object.create(observerOrNext);
                    if (isFunction(context.unsubscribe)) {
                        _this.add(context.unsubscribe.bind(context));
                    }
                    context.unsubscribe = _this.unsubscribe.bind(_this);
                }
            }
            _this._context = context;
            _this._next = next;
            _this._error = error;
            _this._complete = complete;
            return _this;
        }
        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parentSubscriber = this._parentSubscriber;
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                }
                else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
                if (this._error) {
                    if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, this._error, err);
                        this.unsubscribe();
                    }
                }
                else if (!_parentSubscriber.syncErrorThrowable) {
                    this.unsubscribe();
                    if (useDeprecatedSynchronousErrorHandling) {
                        throw err;
                    }
                    hostReportError(err);
                }
                else {
                    if (useDeprecatedSynchronousErrorHandling) {
                        _parentSubscriber.syncErrorValue = err;
                        _parentSubscriber.syncErrorThrown = true;
                    }
                    else {
                        hostReportError(err);
                    }
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            var _this = this;
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._complete) {
                    var wrappedComplete = function () { return _this._complete.call(_this._context); };
                    if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(wrappedComplete);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                        this.unsubscribe();
                    }
                }
                else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                this.unsubscribe();
                if (config.useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                else {
                    hostReportError(err);
                }
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            if (!config.useDeprecatedSynchronousErrorHandling) {
                throw new Error('bad call');
            }
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    parent.syncErrorValue = err;
                    parent.syncErrorThrown = true;
                    return true;
                }
                else {
                    hostReportError(err);
                    return true;
                }
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parentSubscriber = this._parentSubscriber;
            this._context = null;
            this._parentSubscriber = null;
            _parentSubscriber.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber));

    function canReportError(observer) {
        while (observer) {
            var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
            if (closed_1 || isStopped) {
                return false;
            }
            else if (destination && destination instanceof Subscriber) {
                observer = destination;
            }
            else {
                observer = null;
            }
        }
        return true;
    }

    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber]) {
                return nextOrObserver[rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber(empty);
        }
        return new Subscriber(nextOrObserver, error, complete);
    }

    var observable = (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

    function identity(x) {
        return x;
    }

    function pipe() {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i] = arguments[_i];
        }
        return pipeFromArray(fns);
    }
    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    var Observable = (function () {
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable$$1 = new Observable();
            observable$$1.source = this;
            observable$$1.operator = operator;
            return observable$$1;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber(observerOrNext, error, complete);
            if (operator) {
                sink.add(operator.call(sink, this.source));
            }
            else {
                sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                    this._subscribe(sink) :
                    this._trySubscribe(sink));
            }
            if (config.useDeprecatedSynchronousErrorHandling) {
                if (sink.syncErrorThrowable) {
                    sink.syncErrorThrowable = false;
                    if (sink.syncErrorThrown) {
                        throw sink.syncErrorValue;
                    }
                }
            }
            return sink;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    sink.syncErrorThrown = true;
                    sink.syncErrorValue = err;
                }
                if (canReportError(sink)) {
                    sink.error(err);
                }
                else {
                    console.warn(err);
                }
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscription;
                subscription = _this.subscribe(function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var source = this.source;
            return source && source.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            if (operations.length === 0) {
                return this;
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        if (!promiseCtor) {
            promiseCtor = config.Promise || Promise;
        }
        if (!promiseCtor) {
            throw new Error('no Promise impl found');
        }
        return promiseCtor;
    }

    var ObjectUnsubscribedErrorImpl = (function () {
        function ObjectUnsubscribedErrorImpl() {
            Error.call(this);
            this.message = 'object unsubscribed';
            this.name = 'ObjectUnsubscribedError';
            return this;
        }
        ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
        return ObjectUnsubscribedErrorImpl;
    })();
    var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

    var SubjectSubscription = (function (_super) {
        __extends(SubjectSubscription, _super);
        function SubjectSubscription(subject, subscriber) {
            var _this = _super.call(this) || this;
            _this.subject = subject;
            _this.subscriber = subscriber;
            _this.closed = false;
            return _this;
        }
        SubjectSubscription.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.closed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
                observers.splice(subscriberIndex, 1);
            }
        };
        return SubjectSubscription;
    }(Subscription));

    var SubjectSubscriber = (function (_super) {
        __extends(SubjectSubscriber, _super);
        function SubjectSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            return _this;
        }
        return SubjectSubscriber;
    }(Subscriber));
    var Subject = (function (_super) {
        __extends(Subject, _super);
        function Subject() {
            var _this = _super.call(this) || this;
            _this.observers = [];
            _this.closed = false;
            _this.isStopped = false;
            _this.hasError = false;
            _this.thrownError = null;
            return _this;
        }
        Subject.prototype[rxSubscriber] = function () {
            return new SubjectSubscriber(this);
        };
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype.next = function (value) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].next(value);
                }
            }
        };
        Subject.prototype.error = function (err) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].error(err);
            }
            this.observers.length = 0;
        };
        Subject.prototype.complete = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].complete();
            }
            this.observers.length = 0;
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = true;
            this.closed = true;
            this.observers = null;
        };
        Subject.prototype._trySubscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return _super.prototype._trySubscribe.call(this, subscriber);
            }
        };
        Subject.prototype._subscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.isStopped) {
                subscriber.complete();
                return Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                return new SubjectSubscription(this, subscriber);
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable));
    var AnonymousSubject = (function (_super) {
        __extends(AnonymousSubject, _super);
        function AnonymousSubject(destination, source) {
            var _this = _super.call(this) || this;
            _this.destination = destination;
            _this.source = source;
            return _this;
        }
        AnonymousSubject.prototype.next = function (value) {
            var destination = this.destination;
            if (destination && destination.next) {
                destination.next(value);
            }
        };
        AnonymousSubject.prototype.error = function (err) {
            var destination = this.destination;
            if (destination && destination.error) {
                this.destination.error(err);
            }
        };
        AnonymousSubject.prototype.complete = function () {
            var destination = this.destination;
            if (destination && destination.complete) {
                this.destination.complete();
            }
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var source = this.source;
            if (source) {
                return this.source.subscribe(subscriber);
            }
            else {
                return Subscription.EMPTY;
            }
        };
        return AnonymousSubject;
    }(Subject));

    function refCount() {
        return function refCountOperatorFunction(source) {
            return source.lift(new RefCountOperator(source));
        };
    }
    var RefCountOperator = (function () {
        function RefCountOperator(connectable) {
            this.connectable = connectable;
        }
        RefCountOperator.prototype.call = function (subscriber, source) {
            var connectable = this.connectable;
            connectable._refCount++;
            var refCounter = new RefCountSubscriber(subscriber, connectable);
            var subscription = source.subscribe(refCounter);
            if (!refCounter.closed) {
                refCounter.connection = connectable.connect();
            }
            return subscription;
        };
        return RefCountOperator;
    }());
    var RefCountSubscriber = (function (_super) {
        __extends(RefCountSubscriber, _super);
        function RefCountSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount = connectable._refCount;
            if (refCount <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount - 1;
            if (refCount > 1) {
                this.connection = null;
                return;
            }
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    var ConnectableObservable = (function (_super) {
        __extends(ConnectableObservable, _super);
        function ConnectableObservable(source, subjectFactory) {
            var _this = _super.call(this) || this;
            _this.source = source;
            _this.subjectFactory = subjectFactory;
            _this._refCount = 0;
            _this._isComplete = false;
            return _this;
        }
        ConnectableObservable.prototype._subscribe = function (subscriber) {
            return this.getSubject().subscribe(subscriber);
        };
        ConnectableObservable.prototype.getSubject = function () {
            var subject = this._subject;
            if (!subject || subject.isStopped) {
                this._subject = this.subjectFactory();
            }
            return this._subject;
        };
        ConnectableObservable.prototype.connect = function () {
            var connection = this._connection;
            if (!connection) {
                this._isComplete = false;
                connection = this._connection = new Subscription();
                connection.add(this.source
                    .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
                if (connection.closed) {
                    this._connection = null;
                    connection = Subscription.EMPTY;
                }
            }
            return connection;
        };
        ConnectableObservable.prototype.refCount = function () {
            return refCount()(this);
        };
        return ConnectableObservable;
    }(Observable));
    var connectableObservableDescriptor = (function () {
        var connectableProto = ConnectableObservable.prototype;
        return {
            operator: { value: null },
            _refCount: { value: 0, writable: true },
            _subject: { value: null, writable: true },
            _connection: { value: null, writable: true },
            _subscribe: { value: connectableProto._subscribe },
            _isComplete: { value: connectableProto._isComplete, writable: true },
            getSubject: { value: connectableProto.getSubject },
            connect: { value: connectableProto.connect },
            refCount: { value: connectableProto.refCount }
        };
    })();
    var ConnectableSubscriber = (function (_super) {
        __extends(ConnectableSubscriber, _super);
        function ConnectableSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        ConnectableSubscriber.prototype._error = function (err) {
            this._unsubscribe();
            _super.prototype._error.call(this, err);
        };
        ConnectableSubscriber.prototype._complete = function () {
            this.connectable._isComplete = true;
            this._unsubscribe();
            _super.prototype._complete.call(this);
        };
        ConnectableSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (connectable) {
                this.connectable = null;
                var connection = connectable._connection;
                connectable._refCount = 0;
                connectable._subject = null;
                connectable._connection = null;
                if (connection) {
                    connection.unsubscribe();
                }
            }
        };
        return ConnectableSubscriber;
    }(SubjectSubscriber));
    var RefCountSubscriber$1 = (function (_super) {
        __extends(RefCountSubscriber, _super);
        function RefCountSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount$$1 = connectable._refCount;
            if (refCount$$1 <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount$$1 - 1;
            if (refCount$$1 > 1) {
                this.connection = null;
                return;
            }
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
        return function (source) {
            return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
        };
    }
    var GroupByOperator = (function () {
        function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
            this.keySelector = keySelector;
            this.elementSelector = elementSelector;
            this.durationSelector = durationSelector;
            this.subjectSelector = subjectSelector;
        }
        GroupByOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
        };
        return GroupByOperator;
    }());
    var GroupBySubscriber = (function (_super) {
        __extends(GroupBySubscriber, _super);
        function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
            var _this = _super.call(this, destination) || this;
            _this.keySelector = keySelector;
            _this.elementSelector = elementSelector;
            _this.durationSelector = durationSelector;
            _this.subjectSelector = subjectSelector;
            _this.groups = null;
            _this.attemptedToUnsubscribe = false;
            _this.count = 0;
            return _this;
        }
        GroupBySubscriber.prototype._next = function (value) {
            var key;
            try {
                key = this.keySelector(value);
            }
            catch (err) {
                this.error(err);
                return;
            }
            this._group(value, key);
        };
        GroupBySubscriber.prototype._group = function (value, key) {
            var groups = this.groups;
            if (!groups) {
                groups = this.groups = new Map();
            }
            var group = groups.get(key);
            var element;
            if (this.elementSelector) {
                try {
                    element = this.elementSelector(value);
                }
                catch (err) {
                    this.error(err);
                }
            }
            else {
                element = value;
            }
            if (!group) {
                group = (this.subjectSelector ? this.subjectSelector() : new Subject());
                groups.set(key, group);
                var groupedObservable = new GroupedObservable(key, group, this);
                this.destination.next(groupedObservable);
                if (this.durationSelector) {
                    var duration = void 0;
                    try {
                        duration = this.durationSelector(new GroupedObservable(key, group));
                    }
                    catch (err) {
                        this.error(err);
                        return;
                    }
                    this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
                }
            }
            if (!group.closed) {
                group.next(element);
            }
        };
        GroupBySubscriber.prototype._error = function (err) {
            var groups = this.groups;
            if (groups) {
                groups.forEach(function (group, key) {
                    group.error(err);
                });
                groups.clear();
            }
            this.destination.error(err);
        };
        GroupBySubscriber.prototype._complete = function () {
            var groups = this.groups;
            if (groups) {
                groups.forEach(function (group, key) {
                    group.complete();
                });
                groups.clear();
            }
            this.destination.complete();
        };
        GroupBySubscriber.prototype.removeGroup = function (key) {
            this.groups.delete(key);
        };
        GroupBySubscriber.prototype.unsubscribe = function () {
            if (!this.closed) {
                this.attemptedToUnsubscribe = true;
                if (this.count === 0) {
                    _super.prototype.unsubscribe.call(this);
                }
            }
        };
        return GroupBySubscriber;
    }(Subscriber));
    var GroupDurationSubscriber = (function (_super) {
        __extends(GroupDurationSubscriber, _super);
        function GroupDurationSubscriber(key, group, parent) {
            var _this = _super.call(this, group) || this;
            _this.key = key;
            _this.group = group;
            _this.parent = parent;
            return _this;
        }
        GroupDurationSubscriber.prototype._next = function (value) {
            this.complete();
        };
        GroupDurationSubscriber.prototype._unsubscribe = function () {
            var _a = this, parent = _a.parent, key = _a.key;
            this.key = this.parent = null;
            if (parent) {
                parent.removeGroup(key);
            }
        };
        return GroupDurationSubscriber;
    }(Subscriber));
    var GroupedObservable = (function (_super) {
        __extends(GroupedObservable, _super);
        function GroupedObservable(key, groupSubject, refCountSubscription) {
            var _this = _super.call(this) || this;
            _this.key = key;
            _this.groupSubject = groupSubject;
            _this.refCountSubscription = refCountSubscription;
            return _this;
        }
        GroupedObservable.prototype._subscribe = function (subscriber) {
            var subscription = new Subscription();
            var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
            if (refCountSubscription && !refCountSubscription.closed) {
                subscription.add(new InnerRefCountSubscription(refCountSubscription));
            }
            subscription.add(groupSubject.subscribe(subscriber));
            return subscription;
        };
        return GroupedObservable;
    }(Observable));
    var InnerRefCountSubscription = (function (_super) {
        __extends(InnerRefCountSubscription, _super);
        function InnerRefCountSubscription(parent) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            parent.count++;
            return _this;
        }
        InnerRefCountSubscription.prototype.unsubscribe = function () {
            var parent = this.parent;
            if (!parent.closed && !this.closed) {
                _super.prototype.unsubscribe.call(this);
                parent.count -= 1;
                if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                    parent.unsubscribe();
                }
            }
        };
        return InnerRefCountSubscription;
    }(Subscription));

    var BehaviorSubject = (function (_super) {
        __extends(BehaviorSubject, _super);
        function BehaviorSubject(_value) {
            var _this = _super.call(this) || this;
            _this._value = _value;
            return _this;
        }
        Object.defineProperty(BehaviorSubject.prototype, "value", {
            get: function () {
                return this.getValue();
            },
            enumerable: true,
            configurable: true
        });
        BehaviorSubject.prototype._subscribe = function (subscriber) {
            var subscription = _super.prototype._subscribe.call(this, subscriber);
            if (subscription && !subscription.closed) {
                subscriber.next(this._value);
            }
            return subscription;
        };
        BehaviorSubject.prototype.getValue = function () {
            if (this.hasError) {
                throw this.thrownError;
            }
            else if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return this._value;
            }
        };
        BehaviorSubject.prototype.next = function (value) {
            _super.prototype.next.call(this, this._value = value);
        };
        return BehaviorSubject;
    }(Subject));

    var Action = (function (_super) {
        __extends(Action, _super);
        function Action(scheduler, work) {
            return _super.call(this) || this;
        }
        Action.prototype.schedule = function (state, delay) {
            if (delay === void 0) { delay = 0; }
            return this;
        };
        return Action;
    }(Subscription));

    var AsyncAction = (function (_super) {
        __extends(AsyncAction, _super);
        function AsyncAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.pending = false;
            return _this;
        }
        AsyncAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) { delay = 0; }
            if (this.closed) {
                return this;
            }
            this.state = state;
            var id = this.id;
            var scheduler = this.scheduler;
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, delay);
            }
            this.pending = true;
            this.delay = delay;
            this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
            return this;
        };
        AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            return setInterval(scheduler.flush.bind(scheduler, this), delay);
        };
        AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            if (delay !== null && this.delay === delay && this.pending === false) {
                return id;
            }
            clearInterval(id);
            return undefined;
        };
        AsyncAction.prototype.execute = function (state, delay) {
            if (this.closed) {
                return new Error('executing a cancelled action');
            }
            this.pending = false;
            var error = this._execute(state, delay);
            if (error) {
                return error;
            }
            else if (this.pending === false && this.id != null) {
                this.id = this.recycleAsyncId(this.scheduler, this.id, null);
            }
        };
        AsyncAction.prototype._execute = function (state, delay) {
            var errored = false;
            var errorValue = undefined;
            try {
                this.work(state);
            }
            catch (e) {
                errored = true;
                errorValue = !!e && e || new Error(e);
            }
            if (errored) {
                this.unsubscribe();
                return errorValue;
            }
        };
        AsyncAction.prototype._unsubscribe = function () {
            var id = this.id;
            var scheduler = this.scheduler;
            var actions = scheduler.actions;
            var index = actions.indexOf(this);
            this.work = null;
            this.state = null;
            this.pending = false;
            this.scheduler = null;
            if (index !== -1) {
                actions.splice(index, 1);
            }
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, null);
            }
            this.delay = null;
        };
        return AsyncAction;
    }(Action));

    var QueueAction = (function (_super) {
        __extends(QueueAction, _super);
        function QueueAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        QueueAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) { delay = 0; }
            if (delay > 0) {
                return _super.prototype.schedule.call(this, state, delay);
            }
            this.delay = delay;
            this.state = state;
            this.scheduler.flush(this);
            return this;
        };
        QueueAction.prototype.execute = function (state, delay) {
            return (delay > 0 || this.closed) ?
                _super.prototype.execute.call(this, state, delay) :
                this._execute(state, delay);
        };
        QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            return scheduler.flush(this);
        };
        return QueueAction;
    }(AsyncAction));

    var Scheduler = (function () {
        function Scheduler(SchedulerAction, now) {
            if (now === void 0) { now = Scheduler.now; }
            this.SchedulerAction = SchedulerAction;
            this.now = now;
        }
        Scheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) { delay = 0; }
            return new this.SchedulerAction(this, work).schedule(state, delay);
        };
        Scheduler.now = function () { return Date.now(); };
        return Scheduler;
    }());

    var AsyncScheduler = (function (_super) {
        __extends(AsyncScheduler, _super);
        function AsyncScheduler(SchedulerAction, now) {
            if (now === void 0) { now = Scheduler.now; }
            var _this = _super.call(this, SchedulerAction, function () {
                if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                    return AsyncScheduler.delegate.now();
                }
                else {
                    return now();
                }
            }) || this;
            _this.actions = [];
            _this.active = false;
            _this.scheduled = undefined;
            return _this;
        }
        AsyncScheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) { delay = 0; }
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
                return AsyncScheduler.delegate.schedule(work, delay, state);
            }
            else {
                return _super.prototype.schedule.call(this, work, delay, state);
            }
        };
        AsyncScheduler.prototype.flush = function (action) {
            var actions = this.actions;
            if (this.active) {
                actions.push(action);
                return;
            }
            var error;
            this.active = true;
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (action = actions.shift());
            this.active = false;
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsyncScheduler;
    }(Scheduler));

    var QueueScheduler = (function (_super) {
        __extends(QueueScheduler, _super);
        function QueueScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return QueueScheduler;
    }(AsyncScheduler));

    var queueScheduler = new QueueScheduler(QueueAction);
    var queue = queueScheduler;

    var EMPTY = new Observable(function (subscriber) { return subscriber.complete(); });
    function empty$1(scheduler) {
        return scheduler ? emptyScheduled(scheduler) : EMPTY;
    }
    function emptyScheduled(scheduler) {
        return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
    }

    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }

    var subscribeToArray = function (array) { return function (subscriber) {
        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    }; };

    function scheduleArray(input, scheduler) {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            var i = 0;
            sub.add(scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                    return;
                }
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    sub.add(this.schedule());
                }
            }));
            return sub;
        });
    }

    function fromArray(input, scheduler) {
        if (!scheduler) {
            return new Observable(subscribeToArray(input));
        }
        else {
            return scheduleArray(input, scheduler);
        }
    }

    function of() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var scheduler = args[args.length - 1];
        if (isScheduler(scheduler)) {
            args.pop();
            return scheduleArray(args, scheduler);
        }
        else {
            return fromArray(args);
        }
    }

    function throwError(error, scheduler) {
        if (!scheduler) {
            return new Observable(function (subscriber) { return subscriber.error(error); });
        }
        else {
            return new Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
        }
    }
    function dispatch(_a) {
        var error = _a.error, subscriber = _a.subscriber;
        subscriber.error(error);
    }

    (function (NotificationKind) {
        NotificationKind["NEXT"] = "N";
        NotificationKind["ERROR"] = "E";
        NotificationKind["COMPLETE"] = "C";
    })(exports.NotificationKind || (exports.NotificationKind = {}));
    var Notification = (function () {
        function Notification(kind, value, error) {
            this.kind = kind;
            this.value = value;
            this.error = error;
            this.hasValue = kind === 'N';
        }
        Notification.prototype.observe = function (observer) {
            switch (this.kind) {
                case 'N':
                    return observer.next && observer.next(this.value);
                case 'E':
                    return observer.error && observer.error(this.error);
                case 'C':
                    return observer.complete && observer.complete();
            }
        };
        Notification.prototype.do = function (next, error, complete) {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return next && next(this.value);
                case 'E':
                    return error && error(this.error);
                case 'C':
                    return complete && complete();
            }
        };
        Notification.prototype.accept = function (nextOrObserver, error, complete) {
            if (nextOrObserver && typeof nextOrObserver.next === 'function') {
                return this.observe(nextOrObserver);
            }
            else {
                return this.do(nextOrObserver, error, complete);
            }
        };
        Notification.prototype.toObservable = function () {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return of(this.value);
                case 'E':
                    return throwError(this.error);
                case 'C':
                    return empty$1();
            }
            throw new Error('unexpected notification kind value');
        };
        Notification.createNext = function (value) {
            if (typeof value !== 'undefined') {
                return new Notification('N', value);
            }
            return Notification.undefinedValueNotification;
        };
        Notification.createError = function (err) {
            return new Notification('E', undefined, err);
        };
        Notification.createComplete = function () {
            return Notification.completeNotification;
        };
        Notification.completeNotification = new Notification('C');
        Notification.undefinedValueNotification = new Notification('N', undefined);
        return Notification;
    }());

    function observeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return function observeOnOperatorFunction(source) {
            return source.lift(new ObserveOnOperator(scheduler, delay));
        };
    }
    var ObserveOnOperator = (function () {
        function ObserveOnOperator(scheduler, delay) {
            if (delay === void 0) { delay = 0; }
            this.scheduler = scheduler;
            this.delay = delay;
        }
        ObserveOnOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
        };
        return ObserveOnOperator;
    }());
    var ObserveOnSubscriber = (function (_super) {
        __extends(ObserveOnSubscriber, _super);
        function ObserveOnSubscriber(destination, scheduler, delay) {
            if (delay === void 0) { delay = 0; }
            var _this = _super.call(this, destination) || this;
            _this.scheduler = scheduler;
            _this.delay = delay;
            return _this;
        }
        ObserveOnSubscriber.dispatch = function (arg) {
            var notification = arg.notification, destination = arg.destination;
            notification.observe(destination);
            this.unsubscribe();
        };
        ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
            var destination = this.destination;
            destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
        };
        ObserveOnSubscriber.prototype._next = function (value) {
            this.scheduleMessage(Notification.createNext(value));
        };
        ObserveOnSubscriber.prototype._error = function (err) {
            this.scheduleMessage(Notification.createError(err));
            this.unsubscribe();
        };
        ObserveOnSubscriber.prototype._complete = function () {
            this.scheduleMessage(Notification.createComplete());
            this.unsubscribe();
        };
        return ObserveOnSubscriber;
    }(Subscriber));
    var ObserveOnMessage = (function () {
        function ObserveOnMessage(notification, destination) {
            this.notification = notification;
            this.destination = destination;
        }
        return ObserveOnMessage;
    }());

    var ReplaySubject = (function (_super) {
        __extends(ReplaySubject, _super);
        function ReplaySubject(bufferSize, windowTime, scheduler) {
            if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
            if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
            var _this = _super.call(this) || this;
            _this.scheduler = scheduler;
            _this._events = [];
            _this._infiniteTimeWindow = false;
            _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
            _this._windowTime = windowTime < 1 ? 1 : windowTime;
            if (windowTime === Number.POSITIVE_INFINITY) {
                _this._infiniteTimeWindow = true;
                _this.next = _this.nextInfiniteTimeWindow;
            }
            else {
                _this.next = _this.nextTimeWindow;
            }
            return _this;
        }
        ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
            var _events = this._events;
            _events.push(value);
            if (_events.length > this._bufferSize) {
                _events.shift();
            }
            _super.prototype.next.call(this, value);
        };
        ReplaySubject.prototype.nextTimeWindow = function (value) {
            this._events.push(new ReplayEvent(this._getNow(), value));
            this._trimBufferThenGetEvents();
            _super.prototype.next.call(this, value);
        };
        ReplaySubject.prototype._subscribe = function (subscriber) {
            var _infiniteTimeWindow = this._infiniteTimeWindow;
            var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
            var scheduler = this.scheduler;
            var len = _events.length;
            var subscription;
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.isStopped || this.hasError) {
                subscription = Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                subscription = new SubjectSubscription(this, subscriber);
            }
            if (scheduler) {
                subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
            }
            if (_infiniteTimeWindow) {
                for (var i = 0; i < len && !subscriber.closed; i++) {
                    subscriber.next(_events[i]);
                }
            }
            else {
                for (var i = 0; i < len && !subscriber.closed; i++) {
                    subscriber.next(_events[i].value);
                }
            }
            if (this.hasError) {
                subscriber.error(this.thrownError);
            }
            else if (this.isStopped) {
                subscriber.complete();
            }
            return subscription;
        };
        ReplaySubject.prototype._getNow = function () {
            return (this.scheduler || queue).now();
        };
        ReplaySubject.prototype._trimBufferThenGetEvents = function () {
            var now = this._getNow();
            var _bufferSize = this._bufferSize;
            var _windowTime = this._windowTime;
            var _events = this._events;
            var eventsCount = _events.length;
            var spliceCount = 0;
            while (spliceCount < eventsCount) {
                if ((now - _events[spliceCount].time) < _windowTime) {
                    break;
                }
                spliceCount++;
            }
            if (eventsCount > _bufferSize) {
                spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
            }
            if (spliceCount > 0) {
                _events.splice(0, spliceCount);
            }
            return _events;
        };
        return ReplaySubject;
    }(Subject));
    var ReplayEvent = (function () {
        function ReplayEvent(time, value) {
            this.time = time;
            this.value = value;
        }
        return ReplayEvent;
    }());

    var AsyncSubject = (function (_super) {
        __extends(AsyncSubject, _super);
        function AsyncSubject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.value = null;
            _this.hasNext = false;
            _this.hasCompleted = false;
            return _this;
        }
        AsyncSubject.prototype._subscribe = function (subscriber) {
            if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.hasCompleted && this.hasNext) {
                subscriber.next(this.value);
                subscriber.complete();
                return Subscription.EMPTY;
            }
            return _super.prototype._subscribe.call(this, subscriber);
        };
        AsyncSubject.prototype.next = function (value) {
            if (!this.hasCompleted) {
                this.value = value;
                this.hasNext = true;
            }
        };
        AsyncSubject.prototype.error = function (error) {
            if (!this.hasCompleted) {
                _super.prototype.error.call(this, error);
            }
        };
        AsyncSubject.prototype.complete = function () {
            this.hasCompleted = true;
            if (this.hasNext) {
                _super.prototype.next.call(this, this.value);
            }
            _super.prototype.complete.call(this);
        };
        return AsyncSubject;
    }(Subject));

    var nextHandle = 1;
    var RESOLVED = (function () { return Promise.resolve(); })();
    var activeHandles = {};
    function findAndClearHandle(handle) {
        if (handle in activeHandles) {
            delete activeHandles[handle];
            return true;
        }
        return false;
    }
    var Immediate = {
        setImmediate: function (cb) {
            var handle = nextHandle++;
            activeHandles[handle] = true;
            RESOLVED.then(function () { return findAndClearHandle(handle) && cb(); });
            return handle;
        },
        clearImmediate: function (handle) {
            findAndClearHandle(handle);
        },
    };

    var AsapAction = (function (_super) {
        __extends(AsapAction, _super);
        function AsapAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            if (delay !== null && delay > 0) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
        };
        AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
            }
            if (scheduler.actions.length === 0) {
                Immediate.clearImmediate(id);
                scheduler.scheduled = undefined;
            }
            return undefined;
        };
        return AsapAction;
    }(AsyncAction));

    var AsapScheduler = (function (_super) {
        __extends(AsapScheduler, _super);
        function AsapScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AsapScheduler.prototype.flush = function (action) {
            this.active = true;
            this.scheduled = undefined;
            var actions = this.actions;
            var error;
            var index = -1;
            var count = actions.length;
            action = action || actions.shift();
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (++index < count && (action = actions.shift()));
            this.active = false;
            if (error) {
                while (++index < count && (action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsapScheduler;
    }(AsyncScheduler));

    var asapScheduler = new AsapScheduler(AsapAction);
    var asap = asapScheduler;

    var asyncScheduler = new AsyncScheduler(AsyncAction);
    var async = asyncScheduler;

    var AnimationFrameAction = (function (_super) {
        __extends(AnimationFrameAction, _super);
        function AnimationFrameAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            if (delay !== null && delay > 0) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
        };
        AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
            }
            if (scheduler.actions.length === 0) {
                cancelAnimationFrame(id);
                scheduler.scheduled = undefined;
            }
            return undefined;
        };
        return AnimationFrameAction;
    }(AsyncAction));

    var AnimationFrameScheduler = (function (_super) {
        __extends(AnimationFrameScheduler, _super);
        function AnimationFrameScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimationFrameScheduler.prototype.flush = function (action) {
            this.active = true;
            this.scheduled = undefined;
            var actions = this.actions;
            var error;
            var index = -1;
            var count = actions.length;
            action = action || actions.shift();
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (++index < count && (action = actions.shift()));
            this.active = false;
            if (error) {
                while (++index < count && (action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AnimationFrameScheduler;
    }(AsyncScheduler));

    var animationFrameScheduler = new AnimationFrameScheduler(AnimationFrameAction);
    var animationFrame = animationFrameScheduler;

    var VirtualTimeScheduler = (function (_super) {
        __extends(VirtualTimeScheduler, _super);
        function VirtualTimeScheduler(SchedulerAction, maxFrames) {
            if (SchedulerAction === void 0) { SchedulerAction = VirtualAction; }
            if (maxFrames === void 0) { maxFrames = Number.POSITIVE_INFINITY; }
            var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
            _this.maxFrames = maxFrames;
            _this.frame = 0;
            _this.index = -1;
            return _this;
        }
        VirtualTimeScheduler.prototype.flush = function () {
            var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
            var error, action;
            while ((action = actions[0]) && action.delay <= maxFrames) {
                actions.shift();
                this.frame = action.delay;
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            }
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        VirtualTimeScheduler.frameTimeFactor = 10;
        return VirtualTimeScheduler;
    }(AsyncScheduler));
    var VirtualAction = (function (_super) {
        __extends(VirtualAction, _super);
        function VirtualAction(scheduler, work, index) {
            if (index === void 0) { index = scheduler.index += 1; }
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.index = index;
            _this.active = true;
            _this.index = scheduler.index = index;
            return _this;
        }
        VirtualAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) { delay = 0; }
            if (!this.id) {
                return _super.prototype.schedule.call(this, state, delay);
            }
            this.active = false;
            var action = new VirtualAction(this.scheduler, this.work);
            this.add(action);
            return action.schedule(state, delay);
        };
        VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            this.delay = scheduler.frame + delay;
            var actions = scheduler.actions;
            actions.push(this);
            actions.sort(VirtualAction.sortActions);
            return true;
        };
        VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            return undefined;
        };
        VirtualAction.prototype._execute = function (state, delay) {
            if (this.active === true) {
                return _super.prototype._execute.call(this, state, delay);
            }
        };
        VirtualAction.sortActions = function (a, b) {
            if (a.delay === b.delay) {
                if (a.index === b.index) {
                    return 0;
                }
                else if (a.index > b.index) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
            else if (a.delay > b.delay) {
                return 1;
            }
            else {
                return -1;
            }
        };
        return VirtualAction;
    }(AsyncAction));

    function noop() { }

    function isObservable(obj) {
        return !!obj && (obj instanceof Observable || (typeof obj.lift === 'function' && typeof obj.subscribe === 'function'));
    }

    var ArgumentOutOfRangeErrorImpl = (function () {
        function ArgumentOutOfRangeErrorImpl() {
            Error.call(this);
            this.message = 'argument out of range';
            this.name = 'ArgumentOutOfRangeError';
            return this;
        }
        ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
        return ArgumentOutOfRangeErrorImpl;
    })();
    var ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;

    var EmptyErrorImpl = (function () {
        function EmptyErrorImpl() {
            Error.call(this);
            this.message = 'no elements in sequence';
            this.name = 'EmptyError';
            return this;
        }
        EmptyErrorImpl.prototype = Object.create(Error.prototype);
        return EmptyErrorImpl;
    })();
    var EmptyError = EmptyErrorImpl;

    var TimeoutErrorImpl = (function () {
        function TimeoutErrorImpl() {
            Error.call(this);
            this.message = 'Timeout has occurred';
            this.name = 'TimeoutError';
            return this;
        }
        TimeoutErrorImpl.prototype = Object.create(Error.prototype);
        return TimeoutErrorImpl;
    })();
    var TimeoutError = TimeoutErrorImpl;

    function map(project, thisArg) {
        return function mapOperation(source) {
            if (typeof project !== 'function') {
                throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
            }
            return source.lift(new MapOperator(project, thisArg));
        };
    }
    var MapOperator = (function () {
        function MapOperator(project, thisArg) {
            this.project = project;
            this.thisArg = thisArg;
        }
        MapOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
        };
        return MapOperator;
    }());
    var MapSubscriber = (function (_super) {
        __extends(MapSubscriber, _super);
        function MapSubscriber(destination, project, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.count = 0;
            _this.thisArg = thisArg || _this;
            return _this;
        }
        MapSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.project.call(this.thisArg, value, this.count++);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return MapSubscriber;
    }(Subscriber));

    function bindCallback(callbackFunc, resultSelector, scheduler) {
        if (resultSelector) {
            if (isScheduler(resultSelector)) {
                scheduler = resultSelector;
            }
            else {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
                };
            }
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = this;
            var subject;
            var params = {
                context: context,
                subject: subject,
                callbackFunc: callbackFunc,
                scheduler: scheduler,
            };
            return new Observable(function (subscriber) {
                if (!scheduler) {
                    if (!subject) {
                        subject = new AsyncSubject();
                        var handler = function () {
                            var innerArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                innerArgs[_i] = arguments[_i];
                            }
                            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                            subject.complete();
                        };
                        try {
                            callbackFunc.apply(context, args.concat([handler]));
                        }
                        catch (err) {
                            if (canReportError(subject)) {
                                subject.error(err);
                            }
                            else {
                                console.warn(err);
                            }
                        }
                    }
                    return subject.subscribe(subscriber);
                }
                else {
                    var state = {
                        args: args, subscriber: subscriber, params: params,
                    };
                    return scheduler.schedule(dispatch$1, 0, state);
                }
            });
        };
    }
    function dispatch$1(state) {
        var _this = this;
        var args = state.args, subscriber = state.subscriber, params = state.params;
        var callbackFunc = params.callbackFunc, context = params.context, scheduler = params.scheduler;
        var subject = params.subject;
        if (!subject) {
            subject = params.subject = new AsyncSubject();
            var handler = function () {
                var innerArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    innerArgs[_i] = arguments[_i];
                }
                var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
                _this.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
            };
            try {
                callbackFunc.apply(context, args.concat([handler]));
            }
            catch (err) {
                subject.error(err);
            }
        }
        this.add(subject.subscribe(subscriber));
    }
    function dispatchNext(state) {
        var value = state.value, subject = state.subject;
        subject.next(value);
        subject.complete();
    }

    function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
        if (resultSelector) {
            if (isScheduler(resultSelector)) {
                scheduler = resultSelector;
            }
            else {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
                };
            }
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var params = {
                subject: undefined,
                args: args,
                callbackFunc: callbackFunc,
                scheduler: scheduler,
                context: this,
            };
            return new Observable(function (subscriber) {
                var context = params.context;
                var subject = params.subject;
                if (!scheduler) {
                    if (!subject) {
                        subject = params.subject = new AsyncSubject();
                        var handler = function () {
                            var innerArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                innerArgs[_i] = arguments[_i];
                            }
                            var err = innerArgs.shift();
                            if (err) {
                                subject.error(err);
                                return;
                            }
                            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                            subject.complete();
                        };
                        try {
                            callbackFunc.apply(context, args.concat([handler]));
                        }
                        catch (err) {
                            if (canReportError(subject)) {
                                subject.error(err);
                            }
                            else {
                                console.warn(err);
                            }
                        }
                    }
                    return subject.subscribe(subscriber);
                }
                else {
                    return scheduler.schedule(dispatch$2, 0, { params: params, subscriber: subscriber, context: context });
                }
            });
        };
    }
    function dispatch$2(state) {
        var _this = this;
        var params = state.params, subscriber = state.subscriber, context = state.context;
        var callbackFunc = params.callbackFunc, args = params.args, scheduler = params.scheduler;
        var subject = params.subject;
        if (!subject) {
            subject = params.subject = new AsyncSubject();
            var handler = function () {
                var innerArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    innerArgs[_i] = arguments[_i];
                }
                var err = innerArgs.shift();
                if (err) {
                    _this.add(scheduler.schedule(dispatchError$1, 0, { err: err, subject: subject }));
                }
                else {
                    var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
                    _this.add(scheduler.schedule(dispatchNext$1, 0, { value: value, subject: subject }));
                }
            };
            try {
                callbackFunc.apply(context, args.concat([handler]));
            }
            catch (err) {
                this.add(scheduler.schedule(dispatchError$1, 0, { err: err, subject: subject }));
            }
        }
        this.add(subject.subscribe(subscriber));
    }
    function dispatchNext$1(arg) {
        var value = arg.value, subject = arg.subject;
        subject.next(value);
        subject.complete();
    }
    function dispatchError$1(arg) {
        var err = arg.err, subject = arg.subject;
        subject.error(err);
    }

    var OuterSubscriber = (function (_super) {
        __extends(OuterSubscriber, _super);
        function OuterSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        OuterSubscriber.prototype.notifyError = function (error, innerSub) {
            this.destination.error(error);
        };
        OuterSubscriber.prototype.notifyComplete = function (innerSub) {
            this.destination.complete();
        };
        return OuterSubscriber;
    }(Subscriber));

    var InnerSubscriber = (function (_super) {
        __extends(InnerSubscriber, _super);
        function InnerSubscriber(parent, outerValue, outerIndex) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            _this.outerValue = outerValue;
            _this.outerIndex = outerIndex;
            _this.index = 0;
            return _this;
        }
        InnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
        };
        InnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error, this);
            this.unsubscribe();
        };
        InnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete(this);
            this.unsubscribe();
        };
        return InnerSubscriber;
    }(Subscriber));

    var subscribeToPromise = function (promise) { return function (subscriber) {
        promise.then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) { return subscriber.error(err); })
            .then(null, hostReportError);
        return subscriber;
    }; };

    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    var iterator = getSymbolIterator();

    var subscribeToIterable = function (iterable) { return function (subscriber) {
        var iterator$$1 = iterable[iterator]();
        do {
            var item = void 0;
            try {
                item = iterator$$1.next();
            }
            catch (err) {
                subscriber.error(err);
                return subscriber;
            }
            if (item.done) {
                subscriber.complete();
                break;
            }
            subscriber.next(item.value);
            if (subscriber.closed) {
                break;
            }
        } while (true);
        if (typeof iterator$$1.return === 'function') {
            subscriber.add(function () {
                if (iterator$$1.return) {
                    iterator$$1.return();
                }
            });
        }
        return subscriber;
    }; };

    var subscribeToObservable = function (obj) { return function (subscriber) {
        var obs = obj[observable]();
        if (typeof obs.subscribe !== 'function') {
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        }
        else {
            return obs.subscribe(subscriber);
        }
    }; };

    var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

    function isPromise(value) {
        return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }

    var subscribeTo = function (result) {
        if (!!result && typeof result[observable] === 'function') {
            return subscribeToObservable(result);
        }
        else if (isArrayLike(result)) {
            return subscribeToArray(result);
        }
        else if (isPromise(result)) {
            return subscribeToPromise(result);
        }
        else if (!!result && typeof result[iterator] === 'function') {
            return subscribeToIterable(result);
        }
        else {
            var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
            var msg = "You provided " + value + " where a stream was expected."
                + ' You can provide an Observable, Promise, Array, or Iterable.';
            throw new TypeError(msg);
        }
    };

    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber) {
        if (innerSubscriber === void 0) { innerSubscriber = new InnerSubscriber(outerSubscriber, outerValue, outerIndex); }
        if (innerSubscriber.closed) {
            return undefined;
        }
        if (result instanceof Observable) {
            return result.subscribe(innerSubscriber);
        }
        return subscribeTo(result)(innerSubscriber);
    }

    var NONE = {};
    function combineLatest() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        var resultSelector = undefined;
        var scheduler = undefined;
        if (isScheduler(observables[observables.length - 1])) {
            scheduler = observables.pop();
        }
        if (typeof observables[observables.length - 1] === 'function') {
            resultSelector = observables.pop();
        }
        if (observables.length === 1 && isArray(observables[0])) {
            observables = observables[0];
        }
        return fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
    }
    var CombineLatestOperator = (function () {
        function CombineLatestOperator(resultSelector) {
            this.resultSelector = resultSelector;
        }
        CombineLatestOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
        };
        return CombineLatestOperator;
    }());
    var CombineLatestSubscriber = (function (_super) {
        __extends(CombineLatestSubscriber, _super);
        function CombineLatestSubscriber(destination, resultSelector) {
            var _this = _super.call(this, destination) || this;
            _this.resultSelector = resultSelector;
            _this.active = 0;
            _this.values = [];
            _this.observables = [];
            return _this;
        }
        CombineLatestSubscriber.prototype._next = function (observable) {
            this.values.push(NONE);
            this.observables.push(observable);
        };
        CombineLatestSubscriber.prototype._complete = function () {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
                this.destination.complete();
            }
            else {
                this.active = len;
                this.toRespond = len;
                for (var i = 0; i < len; i++) {
                    var observable = observables[i];
                    this.add(subscribeToResult(this, observable, undefined, i));
                }
            }
        };
        CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
            if ((this.active -= 1) === 0) {
                this.destination.complete();
            }
        };
        CombineLatestSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
            var values = this.values;
            var oldVal = values[outerIndex];
            var toRespond = !this.toRespond
                ? 0
                : oldVal === NONE ? --this.toRespond : this.toRespond;
            values[outerIndex] = innerValue;
            if (toRespond === 0) {
                if (this.resultSelector) {
                    this._tryResultSelector(values);
                }
                else {
                    this.destination.next(values.slice());
                }
            }
        };
        CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
            var result;
            try {
                result = this.resultSelector.apply(this, values);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return CombineLatestSubscriber;
    }(OuterSubscriber));

    function scheduleObservable(input, scheduler) {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            sub.add(scheduler.schedule(function () {
                var observable$$1 = input[observable]();
                sub.add(observable$$1.subscribe({
                    next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                    error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                    complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
                }));
            }));
            return sub;
        });
    }

    function schedulePromise(input, scheduler) {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            sub.add(scheduler.schedule(function () { return input.then(function (value) {
                sub.add(scheduler.schedule(function () {
                    subscriber.next(value);
                    sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
                }));
            }, function (err) {
                sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
            }); }));
            return sub;
        });
    }

    function scheduleIterable(input, scheduler) {
        if (!input) {
            throw new Error('Iterable cannot be null');
        }
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            var iterator$$1;
            sub.add(function () {
                if (iterator$$1 && typeof iterator$$1.return === 'function') {
                    iterator$$1.return();
                }
            });
            sub.add(scheduler.schedule(function () {
                iterator$$1 = input[iterator]();
                sub.add(scheduler.schedule(function () {
                    if (subscriber.closed) {
                        return;
                    }
                    var value;
                    var done;
                    try {
                        var result = iterator$$1.next();
                        value = result.value;
                        done = result.done;
                    }
                    catch (err) {
                        subscriber.error(err);
                        return;
                    }
                    if (done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(value);
                        this.schedule();
                    }
                }));
            }));
            return sub;
        });
    }

    function isInteropObservable(input) {
        return input && typeof input[observable] === 'function';
    }

    function isIterable(input) {
        return input && typeof input[iterator] === 'function';
    }

    function scheduled(input, scheduler) {
        if (input != null) {
            if (isInteropObservable(input)) {
                return scheduleObservable(input, scheduler);
            }
            else if (isPromise(input)) {
                return schedulePromise(input, scheduler);
            }
            else if (isArrayLike(input)) {
                return scheduleArray(input, scheduler);
            }
            else if (isIterable(input) || typeof input === 'string') {
                return scheduleIterable(input, scheduler);
            }
        }
        throw new TypeError((input !== null && typeof input || input) + ' is not observable');
    }

    function from(input, scheduler) {
        if (!scheduler) {
            if (input instanceof Observable) {
                return input;
            }
            return new Observable(subscribeTo(input));
        }
        else {
            return scheduled(input, scheduler);
        }
    }

    var SimpleInnerSubscriber = (function (_super) {
        __extends(SimpleInnerSubscriber, _super);
        function SimpleInnerSubscriber(parent) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            return _this;
        }
        SimpleInnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(value);
        };
        SimpleInnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error);
            this.unsubscribe();
        };
        SimpleInnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete();
            this.unsubscribe();
        };
        return SimpleInnerSubscriber;
    }(Subscriber));
    var ComplexInnerSubscriber = (function (_super) {
        __extends(ComplexInnerSubscriber, _super);
        function ComplexInnerSubscriber(parent, outerValue, outerIndex) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            _this.outerValue = outerValue;
            _this.outerIndex = outerIndex;
            return _this;
        }
        ComplexInnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this);
        };
        ComplexInnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error);
            this.unsubscribe();
        };
        ComplexInnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete(this);
            this.unsubscribe();
        };
        return ComplexInnerSubscriber;
    }(Subscriber));
    var SimpleOuterSubscriber = (function (_super) {
        __extends(SimpleOuterSubscriber, _super);
        function SimpleOuterSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SimpleOuterSubscriber.prototype.notifyNext = function (innerValue) {
            this.destination.next(innerValue);
        };
        SimpleOuterSubscriber.prototype.notifyError = function (err) {
            this.destination.error(err);
        };
        SimpleOuterSubscriber.prototype.notifyComplete = function () {
            this.destination.complete();
        };
        return SimpleOuterSubscriber;
    }(Subscriber));
    var ComplexOuterSubscriber = (function (_super) {
        __extends(ComplexOuterSubscriber, _super);
        function ComplexOuterSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ComplexOuterSubscriber.prototype.notifyNext = function (_outerValue, innerValue, _outerIndex, _innerSub) {
            this.destination.next(innerValue);
        };
        ComplexOuterSubscriber.prototype.notifyError = function (error) {
            this.destination.error(error);
        };
        ComplexOuterSubscriber.prototype.notifyComplete = function (_innerSub) {
            this.destination.complete();
        };
        return ComplexOuterSubscriber;
    }(Subscriber));
    function innerSubscribe(result, innerSubscriber) {
        if (innerSubscriber.closed) {
            return undefined;
        }
        if (result instanceof Observable) {
            return result.subscribe(innerSubscriber);
        }
        return subscribeTo(result)(innerSubscriber);
    }

    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        if (typeof resultSelector === 'function') {
            return function (source) { return source.pipe(mergeMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
        }
        else if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
        }
        return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
    }
    var MergeMapOperator = (function () {
        function MergeMapOperator(project, concurrent) {
            if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
            this.project = project;
            this.concurrent = concurrent;
        }
        MergeMapOperator.prototype.call = function (observer, source) {
            return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
        };
        return MergeMapOperator;
    }());
    var MergeMapSubscriber = (function (_super) {
        __extends(MergeMapSubscriber, _super);
        function MergeMapSubscriber(destination, project, concurrent) {
            if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.concurrent = concurrent;
            _this.hasCompleted = false;
            _this.buffer = [];
            _this.active = 0;
            _this.index = 0;
            return _this;
        }
        MergeMapSubscriber.prototype._next = function (value) {
            if (this.active < this.concurrent) {
                this._tryNext(value);
            }
            else {
                this.buffer.push(value);
            }
        };
        MergeMapSubscriber.prototype._tryNext = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.active++;
            this._innerSub(result);
        };
        MergeMapSubscriber.prototype._innerSub = function (ish) {
            var innerSubscriber = new SimpleInnerSubscriber(this);
            var destination = this.destination;
            destination.add(innerSubscriber);
            var innerSubscription = innerSubscribe(ish, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                destination.add(innerSubscription);
            }
        };
        MergeMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
            this.unsubscribe();
        };
        MergeMapSubscriber.prototype.notifyNext = function (innerValue) {
            this.destination.next(innerValue);
        };
        MergeMapSubscriber.prototype.notifyComplete = function () {
            var buffer = this.buffer;
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            }
            else if (this.active === 0 && this.hasCompleted) {
                this.destination.complete();
            }
        };
        return MergeMapSubscriber;
    }(SimpleOuterSubscriber));
    var flatMap = mergeMap;

    function mergeAll(concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        return mergeMap(identity, concurrent);
    }

    function concatAll() {
        return mergeAll(1);
    }

    function concat() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        return concatAll()(of.apply(void 0, observables));
    }

    function defer(observableFactory) {
        return new Observable(function (subscriber) {
            var input;
            try {
                input = observableFactory();
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
            var source = input ? from(input) : empty$1();
            return source.subscribe(subscriber);
        });
    }

    function forkJoin() {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
        }
        if (sources.length === 1) {
            var first_1 = sources[0];
            if (isArray(first_1)) {
                return forkJoinInternal(first_1, null);
            }
            if (isObject(first_1) && Object.getPrototypeOf(first_1) === Object.prototype) {
                var keys = Object.keys(first_1);
                return forkJoinInternal(keys.map(function (key) { return first_1[key]; }), keys);
            }
        }
        if (typeof sources[sources.length - 1] === 'function') {
            var resultSelector_1 = sources.pop();
            sources = (sources.length === 1 && isArray(sources[0])) ? sources[0] : sources;
            return forkJoinInternal(sources, null).pipe(map(function (args) { return resultSelector_1.apply(void 0, args); }));
        }
        return forkJoinInternal(sources, null);
    }
    function forkJoinInternal(sources, keys) {
        return new Observable(function (subscriber) {
            var len = sources.length;
            if (len === 0) {
                subscriber.complete();
                return;
            }
            var values = new Array(len);
            var completed = 0;
            var emitted = 0;
            var _loop_1 = function (i) {
                var source = from(sources[i]);
                var hasValue = false;
                subscriber.add(source.subscribe({
                    next: function (value) {
                        if (!hasValue) {
                            hasValue = true;
                            emitted++;
                        }
                        values[i] = value;
                    },
                    error: function (err) { return subscriber.error(err); },
                    complete: function () {
                        completed++;
                        if (completed === len || !hasValue) {
                            if (emitted === len) {
                                subscriber.next(keys ?
                                    keys.reduce(function (result, key, i) { return (result[key] = values[i], result); }, {}) :
                                    values);
                            }
                            subscriber.complete();
                        }
                    }
                }));
            };
            for (var i = 0; i < len; i++) {
                _loop_1(i);
            }
        });
    }

    function fromEvent(target, eventName, options, resultSelector) {
        if (isFunction(options)) {
            resultSelector = options;
            options = undefined;
        }
        if (resultSelector) {
            return fromEvent(target, eventName, options).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
        }
        return new Observable(function (subscriber) {
            function handler(e) {
                if (arguments.length > 1) {
                    subscriber.next(Array.prototype.slice.call(arguments));
                }
                else {
                    subscriber.next(e);
                }
            }
            setupSubscription(target, eventName, handler, subscriber, options);
        });
    }
    function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
        var unsubscribe;
        if (isEventTarget(sourceObj)) {
            var source_1 = sourceObj;
            sourceObj.addEventListener(eventName, handler, options);
            unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
        }
        else if (isJQueryStyleEventEmitter(sourceObj)) {
            var source_2 = sourceObj;
            sourceObj.on(eventName, handler);
            unsubscribe = function () { return source_2.off(eventName, handler); };
        }
        else if (isNodeStyleEventEmitter(sourceObj)) {
            var source_3 = sourceObj;
            sourceObj.addListener(eventName, handler);
            unsubscribe = function () { return source_3.removeListener(eventName, handler); };
        }
        else if (sourceObj && sourceObj.length) {
            for (var i = 0, len = sourceObj.length; i < len; i++) {
                setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
            }
        }
        else {
            throw new TypeError('Invalid event target');
        }
        subscriber.add(unsubscribe);
    }
    function isNodeStyleEventEmitter(sourceObj) {
        return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
    }
    function isJQueryStyleEventEmitter(sourceObj) {
        return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
    }
    function isEventTarget(sourceObj) {
        return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
    }

    function fromEventPattern(addHandler, removeHandler, resultSelector) {
        if (resultSelector) {
            return fromEventPattern(addHandler, removeHandler).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
        }
        return new Observable(function (subscriber) {
            var handler = function () {
                var e = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    e[_i] = arguments[_i];
                }
                return subscriber.next(e.length === 1 ? e[0] : e);
            };
            var retValue;
            try {
                retValue = addHandler(handler);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
            if (!isFunction(removeHandler)) {
                return undefined;
            }
            return function () { return removeHandler(handler, retValue); };
        });
    }

    function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
        var resultSelector;
        var initialState;
        if (arguments.length == 1) {
            var options = initialStateOrOptions;
            initialState = options.initialState;
            condition = options.condition;
            iterate = options.iterate;
            resultSelector = options.resultSelector || identity;
            scheduler = options.scheduler;
        }
        else if (resultSelectorOrObservable === undefined || isScheduler(resultSelectorOrObservable)) {
            initialState = initialStateOrOptions;
            resultSelector = identity;
            scheduler = resultSelectorOrObservable;
        }
        else {
            initialState = initialStateOrOptions;
            resultSelector = resultSelectorOrObservable;
        }
        return new Observable(function (subscriber) {
            var state = initialState;
            if (scheduler) {
                return scheduler.schedule(dispatch$3, 0, {
                    subscriber: subscriber,
                    iterate: iterate,
                    condition: condition,
                    resultSelector: resultSelector,
                    state: state
                });
            }
            do {
                if (condition) {
                    var conditionResult = void 0;
                    try {
                        conditionResult = condition(state);
                    }
                    catch (err) {
                        subscriber.error(err);
                        return undefined;
                    }
                    if (!conditionResult) {
                        subscriber.complete();
                        break;
                    }
                }
                var value = void 0;
                try {
                    value = resultSelector(state);
                }
                catch (err) {
                    subscriber.error(err);
                    return undefined;
                }
                subscriber.next(value);
                if (subscriber.closed) {
                    break;
                }
                try {
                    state = iterate(state);
                }
                catch (err) {
                    subscriber.error(err);
                    return undefined;
                }
            } while (true);
            return undefined;
        });
    }
    function dispatch$3(state) {
        var subscriber = state.subscriber, condition = state.condition;
        if (subscriber.closed) {
            return undefined;
        }
        if (state.needIterate) {
            try {
                state.state = state.iterate(state.state);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
        }
        else {
            state.needIterate = true;
        }
        if (condition) {
            var conditionResult = void 0;
            try {
                conditionResult = condition(state.state);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
            if (!conditionResult) {
                subscriber.complete();
                return undefined;
            }
            if (subscriber.closed) {
                return undefined;
            }
        }
        var value;
        try {
            value = state.resultSelector(state.state);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (subscriber.closed) {
            return undefined;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return undefined;
        }
        return this.schedule(state);
    }

    function iif(condition, trueResult, falseResult) {
        if (trueResult === void 0) { trueResult = EMPTY; }
        if (falseResult === void 0) { falseResult = EMPTY; }
        return defer(function () { return condition() ? trueResult : falseResult; });
    }

    function isNumeric(val) {
        return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
    }

    function interval(period, scheduler) {
        if (period === void 0) { period = 0; }
        if (scheduler === void 0) { scheduler = async; }
        if (!isNumeric(period) || period < 0) {
            period = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            scheduler = async;
        }
        return new Observable(function (subscriber) {
            subscriber.add(scheduler.schedule(dispatch$4, period, { subscriber: subscriber, counter: 0, period: period }));
            return subscriber;
        });
    }
    function dispatch$4(state) {
        var subscriber = state.subscriber, counter = state.counter, period = state.period;
        subscriber.next(counter);
        this.schedule({ subscriber: subscriber, counter: counter + 1, period: period }, period);
    }

    function merge() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        var concurrent = Number.POSITIVE_INFINITY;
        var scheduler = null;
        var last = observables[observables.length - 1];
        if (isScheduler(last)) {
            scheduler = observables.pop();
            if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
                concurrent = observables.pop();
            }
        }
        else if (typeof last === 'number') {
            concurrent = observables.pop();
        }
        if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable) {
            return observables[0];
        }
        return mergeAll(concurrent)(fromArray(observables, scheduler));
    }

    var NEVER = new Observable(noop);
    function never() {
        return NEVER;
    }

    function onErrorResumeNext() {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
        }
        if (sources.length === 0) {
            return EMPTY;
        }
        var first = sources[0], remainder = sources.slice(1);
        if (sources.length === 1 && isArray(first)) {
            return onErrorResumeNext.apply(void 0, first);
        }
        return new Observable(function (subscriber) {
            var subNext = function () { return subscriber.add(onErrorResumeNext.apply(void 0, remainder).subscribe(subscriber)); };
            return from(first).subscribe({
                next: function (value) { subscriber.next(value); },
                error: subNext,
                complete: subNext,
            });
        });
    }

    function pairs(obj, scheduler) {
        if (!scheduler) {
            return new Observable(function (subscriber) {
                var keys = Object.keys(obj);
                for (var i = 0; i < keys.length && !subscriber.closed; i++) {
                    var key = keys[i];
                    if (obj.hasOwnProperty(key)) {
                        subscriber.next([key, obj[key]]);
                    }
                }
                subscriber.complete();
            });
        }
        else {
            return new Observable(function (subscriber) {
                var keys = Object.keys(obj);
                var subscription = new Subscription();
                subscription.add(scheduler.schedule(dispatch$5, 0, { keys: keys, index: 0, subscriber: subscriber, subscription: subscription, obj: obj }));
                return subscription;
            });
        }
    }
    function dispatch$5(state) {
        var keys = state.keys, index = state.index, subscriber = state.subscriber, subscription = state.subscription, obj = state.obj;
        if (!subscriber.closed) {
            if (index < keys.length) {
                var key = keys[index];
                subscriber.next([key, obj[key]]);
                subscription.add(this.schedule({ keys: keys, index: index + 1, subscriber: subscriber, subscription: subscription, obj: obj }));
            }
            else {
                subscriber.complete();
            }
        }
    }

    function not(pred, thisArg) {
        function notPred() {
            return !(notPred.pred.apply(notPred.thisArg, arguments));
        }
        notPred.pred = pred;
        notPred.thisArg = thisArg;
        return notPred;
    }

    function filter(predicate, thisArg) {
        return function filterOperatorFunction(source) {
            return source.lift(new FilterOperator(predicate, thisArg));
        };
    }
    var FilterOperator = (function () {
        function FilterOperator(predicate, thisArg) {
            this.predicate = predicate;
            this.thisArg = thisArg;
        }
        FilterOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
        };
        return FilterOperator;
    }());
    var FilterSubscriber = (function (_super) {
        __extends(FilterSubscriber, _super);
        function FilterSubscriber(destination, predicate, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.predicate = predicate;
            _this.thisArg = thisArg;
            _this.count = 0;
            return _this;
        }
        FilterSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.predicate.call(this.thisArg, value, this.count++);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            if (result) {
                this.destination.next(value);
            }
        };
        return FilterSubscriber;
    }(Subscriber));

    function partition(source, predicate, thisArg) {
        return [
            filter(predicate, thisArg)(new Observable(subscribeTo(source))),
            filter(not(predicate, thisArg))(new Observable(subscribeTo(source)))
        ];
    }

    function race() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        if (observables.length === 1) {
            if (isArray(observables[0])) {
                observables = observables[0];
            }
            else {
                return observables[0];
            }
        }
        return fromArray(observables, undefined).lift(new RaceOperator());
    }
    var RaceOperator = (function () {
        function RaceOperator() {
        }
        RaceOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new RaceSubscriber(subscriber));
        };
        return RaceOperator;
    }());
    var RaceSubscriber = (function (_super) {
        __extends(RaceSubscriber, _super);
        function RaceSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.hasFirst = false;
            _this.observables = [];
            _this.subscriptions = [];
            return _this;
        }
        RaceSubscriber.prototype._next = function (observable) {
            this.observables.push(observable);
        };
        RaceSubscriber.prototype._complete = function () {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
                this.destination.complete();
            }
            else {
                for (var i = 0; i < len && !this.hasFirst; i++) {
                    var observable = observables[i];
                    var subscription = subscribeToResult(this, observable, undefined, i);
                    if (this.subscriptions) {
                        this.subscriptions.push(subscription);
                    }
                    this.add(subscription);
                }
                this.observables = null;
            }
        };
        RaceSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
            if (!this.hasFirst) {
                this.hasFirst = true;
                for (var i = 0; i < this.subscriptions.length; i++) {
                    if (i !== outerIndex) {
                        var subscription = this.subscriptions[i];
                        subscription.unsubscribe();
                        this.remove(subscription);
                    }
                }
                this.subscriptions = null;
            }
            this.destination.next(innerValue);
        };
        return RaceSubscriber;
    }(OuterSubscriber));

    function range(start, count, scheduler) {
        if (start === void 0) { start = 0; }
        return new Observable(function (subscriber) {
            if (count === undefined) {
                count = start;
                start = 0;
            }
            var index = 0;
            var current = start;
            if (scheduler) {
                return scheduler.schedule(dispatch$6, 0, {
                    index: index, count: count, start: start, subscriber: subscriber
                });
            }
            else {
                do {
                    if (index++ >= count) {
                        subscriber.complete();
                        break;
                    }
                    subscriber.next(current++);
                    if (subscriber.closed) {
                        break;
                    }
                } while (true);
            }
            return undefined;
        });
    }
    function dispatch$6(state) {
        var start = state.start, index = state.index, count = state.count, subscriber = state.subscriber;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(start);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        state.start = start + 1;
        this.schedule(state);
    }

    function timer(dueTime, periodOrScheduler, scheduler) {
        if (dueTime === void 0) { dueTime = 0; }
        var period = -1;
        if (isNumeric(periodOrScheduler)) {
            period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
        }
        else if (isScheduler(periodOrScheduler)) {
            scheduler = periodOrScheduler;
        }
        if (!isScheduler(scheduler)) {
            scheduler = async;
        }
        return new Observable(function (subscriber) {
            var due = isNumeric(dueTime)
                ? dueTime
                : (+dueTime - scheduler.now());
            return scheduler.schedule(dispatch$7, due, {
                index: 0, period: period, subscriber: subscriber
            });
        });
    }
    function dispatch$7(state) {
        var index = state.index, period = state.period, subscriber = state.subscriber;
        subscriber.next(index);
        if (subscriber.closed) {
            return;
        }
        else if (period === -1) {
            return subscriber.complete();
        }
        state.index = index + 1;
        this.schedule(state, period);
    }

    function using(resourceFactory, observableFactory) {
        return new Observable(function (subscriber) {
            var resource;
            try {
                resource = resourceFactory();
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
            var result;
            try {
                result = observableFactory(resource);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
            var source = result ? from(result) : EMPTY;
            var subscription = source.subscribe(subscriber);
            return function () {
                subscription.unsubscribe();
                if (resource) {
                    resource.unsubscribe();
                }
            };
        });
    }

    function zip() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        var resultSelector = observables[observables.length - 1];
        if (typeof resultSelector === 'function') {
            observables.pop();
        }
        return fromArray(observables, undefined).lift(new ZipOperator(resultSelector));
    }
    var ZipOperator = (function () {
        function ZipOperator(resultSelector) {
            this.resultSelector = resultSelector;
        }
        ZipOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
        };
        return ZipOperator;
    }());
    var ZipSubscriber = (function (_super) {
        __extends(ZipSubscriber, _super);
        function ZipSubscriber(destination, resultSelector, values) {
            if (values === void 0) { values = Object.create(null); }
            var _this = _super.call(this, destination) || this;
            _this.resultSelector = resultSelector;
            _this.iterators = [];
            _this.active = 0;
            _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : undefined;
            return _this;
        }
        ZipSubscriber.prototype._next = function (value) {
            var iterators = this.iterators;
            if (isArray(value)) {
                iterators.push(new StaticArrayIterator(value));
            }
            else if (typeof value[iterator] === 'function') {
                iterators.push(new StaticIterator(value[iterator]()));
            }
            else {
                iterators.push(new ZipBufferIterator(this.destination, this, value));
            }
        };
        ZipSubscriber.prototype._complete = function () {
            var iterators = this.iterators;
            var len = iterators.length;
            this.unsubscribe();
            if (len === 0) {
                this.destination.complete();
                return;
            }
            this.active = len;
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                if (iterator$$1.stillUnsubscribed) {
                    var destination = this.destination;
                    destination.add(iterator$$1.subscribe());
                }
                else {
                    this.active--;
                }
            }
        };
        ZipSubscriber.prototype.notifyInactive = function () {
            this.active--;
            if (this.active === 0) {
                this.destination.complete();
            }
        };
        ZipSubscriber.prototype.checkIterators = function () {
            var iterators = this.iterators;
            var len = iterators.length;
            var destination = this.destination;
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                if (typeof iterator$$1.hasValue === 'function' && !iterator$$1.hasValue()) {
                    return;
                }
            }
            var shouldComplete = false;
            var args = [];
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                var result = iterator$$1.next();
                if (iterator$$1.hasCompleted()) {
                    shouldComplete = true;
                }
                if (result.done) {
                    destination.complete();
                    return;
                }
                args.push(result.value);
            }
            if (this.resultSelector) {
                this._tryresultSelector(args);
            }
            else {
                destination.next(args);
            }
            if (shouldComplete) {
                destination.complete();
            }
        };
        ZipSubscriber.prototype._tryresultSelector = function (args) {
            var result;
            try {
                result = this.resultSelector.apply(this, args);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return ZipSubscriber;
    }(Subscriber));
    var StaticIterator = (function () {
        function StaticIterator(iterator$$1) {
            this.iterator = iterator$$1;
            this.nextResult = iterator$$1.next();
        }
        StaticIterator.prototype.hasValue = function () {
            return true;
        };
        StaticIterator.prototype.next = function () {
            var result = this.nextResult;
            this.nextResult = this.iterator.next();
            return result;
        };
        StaticIterator.prototype.hasCompleted = function () {
            var nextResult = this.nextResult;
            return Boolean(nextResult && nextResult.done);
        };
        return StaticIterator;
    }());
    var StaticArrayIterator = (function () {
        function StaticArrayIterator(array) {
            this.array = array;
            this.index = 0;
            this.length = 0;
            this.length = array.length;
        }
        StaticArrayIterator.prototype[iterator] = function () {
            return this;
        };
        StaticArrayIterator.prototype.next = function (value) {
            var i = this.index++;
            var array = this.array;
            return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
        };
        StaticArrayIterator.prototype.hasValue = function () {
            return this.array.length > this.index;
        };
        StaticArrayIterator.prototype.hasCompleted = function () {
            return this.array.length === this.index;
        };
        return StaticArrayIterator;
    }());
    var ZipBufferIterator = (function (_super) {
        __extends(ZipBufferIterator, _super);
        function ZipBufferIterator(destination, parent, observable) {
            var _this = _super.call(this, destination) || this;
            _this.parent = parent;
            _this.observable = observable;
            _this.stillUnsubscribed = true;
            _this.buffer = [];
            _this.isComplete = false;
            return _this;
        }
        ZipBufferIterator.prototype[iterator] = function () {
            return this;
        };
        ZipBufferIterator.prototype.next = function () {
            var buffer = this.buffer;
            if (buffer.length === 0 && this.isComplete) {
                return { value: null, done: true };
            }
            else {
                return { value: buffer.shift(), done: false };
            }
        };
        ZipBufferIterator.prototype.hasValue = function () {
            return this.buffer.length > 0;
        };
        ZipBufferIterator.prototype.hasCompleted = function () {
            return this.buffer.length === 0 && this.isComplete;
        };
        ZipBufferIterator.prototype.notifyComplete = function () {
            if (this.buffer.length > 0) {
                this.isComplete = true;
                this.parent.notifyInactive();
            }
            else {
                this.destination.complete();
            }
        };
        ZipBufferIterator.prototype.notifyNext = function (innerValue) {
            this.buffer.push(innerValue);
            this.parent.checkIterators();
        };
        ZipBufferIterator.prototype.subscribe = function () {
            return innerSubscribe(this.observable, new SimpleInnerSubscriber(this));
        };
        return ZipBufferIterator;
    }(SimpleOuterSubscriber));

    function audit(durationSelector) {
        return function auditOperatorFunction(source) {
            return source.lift(new AuditOperator(durationSelector));
        };
    }
    var AuditOperator = (function () {
        function AuditOperator(durationSelector) {
            this.durationSelector = durationSelector;
        }
        AuditOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
        };
        return AuditOperator;
    }());
    var AuditSubscriber = (function (_super) {
        __extends(AuditSubscriber, _super);
        function AuditSubscriber(destination, durationSelector) {
            var _this = _super.call(this, destination) || this;
            _this.durationSelector = durationSelector;
            _this.hasValue = false;
            return _this;
        }
        AuditSubscriber.prototype._next = function (value) {
            this.value = value;
            this.hasValue = true;
            if (!this.throttled) {
                var duration = void 0;
                try {
                    var durationSelector = this.durationSelector;
                    duration = durationSelector(value);
                }
                catch (err) {
                    return this.destination.error(err);
                }
                var innerSubscription = innerSubscribe(duration, new SimpleInnerSubscriber(this));
                if (!innerSubscription || innerSubscription.closed) {
                    this.clearThrottle();
                }
                else {
                    this.add(this.throttled = innerSubscription);
                }
            }
        };
        AuditSubscriber.prototype.clearThrottle = function () {
            var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
            if (throttled) {
                this.remove(throttled);
                this.throttled = undefined;
                throttled.unsubscribe();
            }
            if (hasValue) {
                this.value = undefined;
                this.hasValue = false;
                this.destination.next(value);
            }
        };
        AuditSubscriber.prototype.notifyNext = function () {
            this.clearThrottle();
        };
        AuditSubscriber.prototype.notifyComplete = function () {
            this.clearThrottle();
        };
        return AuditSubscriber;
    }(SimpleOuterSubscriber));

    function auditTime(duration, scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        return audit(function () { return timer(duration, scheduler); });
    }

    function buffer(closingNotifier) {
        return function bufferOperatorFunction(source) {
            return source.lift(new BufferOperator(closingNotifier));
        };
    }
    var BufferOperator = (function () {
        function BufferOperator(closingNotifier) {
            this.closingNotifier = closingNotifier;
        }
        BufferOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
        };
        return BufferOperator;
    }());
    var BufferSubscriber = (function (_super) {
        __extends(BufferSubscriber, _super);
        function BufferSubscriber(destination, closingNotifier) {
            var _this = _super.call(this, destination) || this;
            _this.buffer = [];
            _this.add(innerSubscribe(closingNotifier, new SimpleInnerSubscriber(_this)));
            return _this;
        }
        BufferSubscriber.prototype._next = function (value) {
            this.buffer.push(value);
        };
        BufferSubscriber.prototype.notifyNext = function () {
            var buffer = this.buffer;
            this.buffer = [];
            this.destination.next(buffer);
        };
        return BufferSubscriber;
    }(SimpleOuterSubscriber));

    function bufferCount(bufferSize, startBufferEvery) {
        if (startBufferEvery === void 0) { startBufferEvery = null; }
        return function bufferCountOperatorFunction(source) {
            return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
        };
    }
    var BufferCountOperator = (function () {
        function BufferCountOperator(bufferSize, startBufferEvery) {
            this.bufferSize = bufferSize;
            this.startBufferEvery = startBufferEvery;
            if (!startBufferEvery || bufferSize === startBufferEvery) {
                this.subscriberClass = BufferCountSubscriber;
            }
            else {
                this.subscriberClass = BufferSkipCountSubscriber;
            }
        }
        BufferCountOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
        };
        return BufferCountOperator;
    }());
    var BufferCountSubscriber = (function (_super) {
        __extends(BufferCountSubscriber, _super);
        function BufferCountSubscriber(destination, bufferSize) {
            var _this = _super.call(this, destination) || this;
            _this.bufferSize = bufferSize;
            _this.buffer = [];
            return _this;
        }
        BufferCountSubscriber.prototype._next = function (value) {
            var buffer = this.buffer;
            buffer.push(value);
            if (buffer.length == this.bufferSize) {
                this.destination.next(buffer);
                this.buffer = [];
            }
        };
        BufferCountSubscriber.prototype._complete = function () {
            var buffer = this.buffer;
            if (buffer.length > 0) {
                this.destination.next(buffer);
            }
            _super.prototype._complete.call(this);
        };
        return BufferCountSubscriber;
    }(Subscriber));
    var BufferSkipCountSubscriber = (function (_super) {
        __extends(BufferSkipCountSubscriber, _super);
        function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
            var _this = _super.call(this, destination) || this;
            _this.bufferSize = bufferSize;
            _this.startBufferEvery = startBufferEvery;
            _this.buffers = [];
            _this.count = 0;
            return _this;
        }
        BufferSkipCountSubscriber.prototype._next = function (value) {
            var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
            this.count++;
            if (count % startBufferEvery === 0) {
                buffers.push([]);
            }
            for (var i = buffers.length; i--;) {
                var buffer = buffers[i];
                buffer.push(value);
                if (buffer.length === bufferSize) {
                    buffers.splice(i, 1);
                    this.destination.next(buffer);
                }
            }
        };
        BufferSkipCountSubscriber.prototype._complete = function () {
            var _a = this, buffers = _a.buffers, destination = _a.destination;
            while (buffers.length > 0) {
                var buffer = buffers.shift();
                if (buffer.length > 0) {
                    destination.next(buffer);
                }
            }
            _super.prototype._complete.call(this);
        };
        return BufferSkipCountSubscriber;
    }(Subscriber));

    function bufferTime(bufferTimeSpan) {
        var length = arguments.length;
        var scheduler = async;
        if (isScheduler(arguments[arguments.length - 1])) {
            scheduler = arguments[arguments.length - 1];
            length--;
        }
        var bufferCreationInterval = null;
        if (length >= 2) {
            bufferCreationInterval = arguments[1];
        }
        var maxBufferSize = Number.POSITIVE_INFINITY;
        if (length >= 3) {
            maxBufferSize = arguments[2];
        }
        return function bufferTimeOperatorFunction(source) {
            return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
        };
    }
    var BufferTimeOperator = (function () {
        function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
            this.bufferTimeSpan = bufferTimeSpan;
            this.bufferCreationInterval = bufferCreationInterval;
            this.maxBufferSize = maxBufferSize;
            this.scheduler = scheduler;
        }
        BufferTimeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
        };
        return BufferTimeOperator;
    }());
    var Context = (function () {
        function Context() {
            this.buffer = [];
        }
        return Context;
    }());
    var BufferTimeSubscriber = (function (_super) {
        __extends(BufferTimeSubscriber, _super);
        function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
            var _this = _super.call(this, destination) || this;
            _this.bufferTimeSpan = bufferTimeSpan;
            _this.bufferCreationInterval = bufferCreationInterval;
            _this.maxBufferSize = maxBufferSize;
            _this.scheduler = scheduler;
            _this.contexts = [];
            var context = _this.openContext();
            _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
            if (_this.timespanOnly) {
                var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
                _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
            }
            else {
                var closeState = { subscriber: _this, context: context };
                var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
                _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
                _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
            }
            return _this;
        }
        BufferTimeSubscriber.prototype._next = function (value) {
            var contexts = this.contexts;
            var len = contexts.length;
            var filledBufferContext;
            for (var i = 0; i < len; i++) {
                var context_1 = contexts[i];
                var buffer = context_1.buffer;
                buffer.push(value);
                if (buffer.length == this.maxBufferSize) {
                    filledBufferContext = context_1;
                }
            }
            if (filledBufferContext) {
                this.onBufferFull(filledBufferContext);
            }
        };
        BufferTimeSubscriber.prototype._error = function (err) {
            this.contexts.length = 0;
            _super.prototype._error.call(this, err);
        };
        BufferTimeSubscriber.prototype._complete = function () {
            var _a = this, contexts = _a.contexts, destination = _a.destination;
            while (contexts.length > 0) {
                var context_2 = contexts.shift();
                destination.next(context_2.buffer);
            }
            _super.prototype._complete.call(this);
        };
        BufferTimeSubscriber.prototype._unsubscribe = function () {
            this.contexts = null;
        };
        BufferTimeSubscriber.prototype.onBufferFull = function (context) {
            this.closeContext(context);
            var closeAction = context.closeAction;
            closeAction.unsubscribe();
            this.remove(closeAction);
            if (!this.closed && this.timespanOnly) {
                context = this.openContext();
                var bufferTimeSpan = this.bufferTimeSpan;
                var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
                this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
            }
        };
        BufferTimeSubscriber.prototype.openContext = function () {
            var context = new Context();
            this.contexts.push(context);
            return context;
        };
        BufferTimeSubscriber.prototype.closeContext = function (context) {
            this.destination.next(context.buffer);
            var contexts = this.contexts;
            var spliceIndex = contexts ? contexts.indexOf(context) : -1;
            if (spliceIndex >= 0) {
                contexts.splice(contexts.indexOf(context), 1);
            }
        };
        return BufferTimeSubscriber;
    }(Subscriber));
    function dispatchBufferTimeSpanOnly(state) {
        var subscriber = state.subscriber;
        var prevContext = state.context;
        if (prevContext) {
            subscriber.closeContext(prevContext);
        }
        if (!subscriber.closed) {
            state.context = subscriber.openContext();
            state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
        }
    }
    function dispatchBufferCreation(state) {
        var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
        var context = subscriber.openContext();
        var action = this;
        if (!subscriber.closed) {
            subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
            action.schedule(state, bufferCreationInterval);
        }
    }
    function dispatchBufferClose(arg) {
        var subscriber = arg.subscriber, context = arg.context;
        subscriber.closeContext(context);
    }

    function bufferToggle(openings, closingSelector) {
        return function bufferToggleOperatorFunction(source) {
            return source.lift(new BufferToggleOperator(openings, closingSelector));
        };
    }
    var BufferToggleOperator = (function () {
        function BufferToggleOperator(openings, closingSelector) {
            this.openings = openings;
            this.closingSelector = closingSelector;
        }
        BufferToggleOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
        };
        return BufferToggleOperator;
    }());
    var BufferToggleSubscriber = (function (_super) {
        __extends(BufferToggleSubscriber, _super);
        function BufferToggleSubscriber(destination, openings, closingSelector) {
            var _this = _super.call(this, destination) || this;
            _this.closingSelector = closingSelector;
            _this.contexts = [];
            _this.add(subscribeToResult(_this, openings));
            return _this;
        }
        BufferToggleSubscriber.prototype._next = function (value) {
            var contexts = this.contexts;
            var len = contexts.length;
            for (var i = 0; i < len; i++) {
                contexts[i].buffer.push(value);
            }
        };
        BufferToggleSubscriber.prototype._error = function (err) {
            var contexts = this.contexts;
            while (contexts.length > 0) {
                var context_1 = contexts.shift();
                context_1.subscription.unsubscribe();
                context_1.buffer = null;
                context_1.subscription = null;
            }
            this.contexts = null;
            _super.prototype._error.call(this, err);
        };
        BufferToggleSubscriber.prototype._complete = function () {
            var contexts = this.contexts;
            while (contexts.length > 0) {
                var context_2 = contexts.shift();
                this.destination.next(context_2.buffer);
                context_2.subscription.unsubscribe();
                context_2.buffer = null;
                context_2.subscription = null;
            }
            this.contexts = null;
            _super.prototype._complete.call(this);
        };
        BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue) {
            outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
        };
        BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
            this.closeBuffer(innerSub.context);
        };
        BufferToggleSubscriber.prototype.openBuffer = function (value) {
            try {
                var closingSelector = this.closingSelector;
                var closingNotifier = closingSelector.call(this, value);
                if (closingNotifier) {
                    this.trySubscribe(closingNotifier);
                }
            }
            catch (err) {
                this._error(err);
            }
        };
        BufferToggleSubscriber.prototype.closeBuffer = function (context) {
            var contexts = this.contexts;
            if (contexts && context) {
                var buffer = context.buffer, subscription = context.subscription;
                this.destination.next(buffer);
                contexts.splice(contexts.indexOf(context), 1);
                this.remove(subscription);
                subscription.unsubscribe();
            }
        };
        BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
            var contexts = this.contexts;
            var buffer = [];
            var subscription = new Subscription();
            var context = { buffer: buffer, subscription: subscription };
            contexts.push(context);
            var innerSubscription = subscribeToResult(this, closingNotifier, context);
            if (!innerSubscription || innerSubscription.closed) {
                this.closeBuffer(context);
            }
            else {
                innerSubscription.context = context;
                this.add(innerSubscription);
                subscription.add(innerSubscription);
            }
        };
        return BufferToggleSubscriber;
    }(OuterSubscriber));

    function bufferWhen(closingSelector) {
        return function (source) {
            return source.lift(new BufferWhenOperator(closingSelector));
        };
    }
    var BufferWhenOperator = (function () {
        function BufferWhenOperator(closingSelector) {
            this.closingSelector = closingSelector;
        }
        BufferWhenOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
        };
        return BufferWhenOperator;
    }());
    var BufferWhenSubscriber = (function (_super) {
        __extends(BufferWhenSubscriber, _super);
        function BufferWhenSubscriber(destination, closingSelector) {
            var _this = _super.call(this, destination) || this;
            _this.closingSelector = closingSelector;
            _this.subscribing = false;
            _this.openBuffer();
            return _this;
        }
        BufferWhenSubscriber.prototype._next = function (value) {
            this.buffer.push(value);
        };
        BufferWhenSubscriber.prototype._complete = function () {
            var buffer = this.buffer;
            if (buffer) {
                this.destination.next(buffer);
            }
            _super.prototype._complete.call(this);
        };
        BufferWhenSubscriber.prototype._unsubscribe = function () {
            this.buffer = undefined;
            this.subscribing = false;
        };
        BufferWhenSubscriber.prototype.notifyNext = function () {
            this.openBuffer();
        };
        BufferWhenSubscriber.prototype.notifyComplete = function () {
            if (this.subscribing) {
                this.complete();
            }
            else {
                this.openBuffer();
            }
        };
        BufferWhenSubscriber.prototype.openBuffer = function () {
            var closingSubscription = this.closingSubscription;
            if (closingSubscription) {
                this.remove(closingSubscription);
                closingSubscription.unsubscribe();
            }
            var buffer = this.buffer;
            if (this.buffer) {
                this.destination.next(buffer);
            }
            this.buffer = [];
            var closingNotifier;
            try {
                var closingSelector = this.closingSelector;
                closingNotifier = closingSelector();
            }
            catch (err) {
                return this.error(err);
            }
            closingSubscription = new Subscription();
            this.closingSubscription = closingSubscription;
            this.add(closingSubscription);
            this.subscribing = true;
            closingSubscription.add(innerSubscribe(closingNotifier, new SimpleInnerSubscriber(this)));
            this.subscribing = false;
        };
        return BufferWhenSubscriber;
    }(SimpleOuterSubscriber));

    function catchError(selector) {
        return function catchErrorOperatorFunction(source) {
            var operator = new CatchOperator(selector);
            var caught = source.lift(operator);
            return (operator.caught = caught);
        };
    }
    var CatchOperator = (function () {
        function CatchOperator(selector) {
            this.selector = selector;
        }
        CatchOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
        };
        return CatchOperator;
    }());
    var CatchSubscriber = (function (_super) {
        __extends(CatchSubscriber, _super);
        function CatchSubscriber(destination, selector, caught) {
            var _this = _super.call(this, destination) || this;
            _this.selector = selector;
            _this.caught = caught;
            return _this;
        }
        CatchSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var result = void 0;
                try {
                    result = this.selector(err, this.caught);
                }
                catch (err2) {
                    _super.prototype.error.call(this, err2);
                    return;
                }
                this._unsubscribeAndRecycle();
                var innerSubscriber = new SimpleInnerSubscriber(this);
                this.add(innerSubscriber);
                var innerSubscription = innerSubscribe(result, innerSubscriber);
                if (innerSubscription !== innerSubscriber) {
                    this.add(innerSubscription);
                }
            }
        };
        return CatchSubscriber;
    }(SimpleOuterSubscriber));

    function combineAll(project) {
        return function (source) { return source.lift(new CombineLatestOperator(project)); };
    }

    function combineLatest$1() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        var project = null;
        if (typeof observables[observables.length - 1] === 'function') {
            project = observables.pop();
        }
        if (observables.length === 1 && isArray(observables[0])) {
            observables = observables[0].slice();
        }
        return function (source) { return source.lift.call(from([source].concat(observables)), new CombineLatestOperator(project)); };
    }

    function concat$1() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        return function (source) { return source.lift.call(concat.apply(void 0, [source].concat(observables))); };
    }

    function concatMap(project, resultSelector) {
        return mergeMap(project, resultSelector, 1);
    }

    function concatMapTo(innerObservable, resultSelector) {
        return concatMap(function () { return innerObservable; }, resultSelector);
    }

    function count(predicate) {
        return function (source) { return source.lift(new CountOperator(predicate, source)); };
    }
    var CountOperator = (function () {
        function CountOperator(predicate, source) {
            this.predicate = predicate;
            this.source = source;
        }
        CountOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
        };
        return CountOperator;
    }());
    var CountSubscriber = (function (_super) {
        __extends(CountSubscriber, _super);
        function CountSubscriber(destination, predicate, source) {
            var _this = _super.call(this, destination) || this;
            _this.predicate = predicate;
            _this.source = source;
            _this.count = 0;
            _this.index = 0;
            return _this;
        }
        CountSubscriber.prototype._next = function (value) {
            if (this.predicate) {
                this._tryPredicate(value);
            }
            else {
                this.count++;
            }
        };
        CountSubscriber.prototype._tryPredicate = function (value) {
            var result;
            try {
                result = this.predicate(value, this.index++, this.source);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            if (result) {
                this.count++;
            }
        };
        CountSubscriber.prototype._complete = function () {
            this.destination.next(this.count);
            this.destination.complete();
        };
        return CountSubscriber;
    }(Subscriber));

    function debounce(durationSelector) {
        return function (source) { return source.lift(new DebounceOperator(durationSelector)); };
    }
    var DebounceOperator = (function () {
        function DebounceOperator(durationSelector) {
            this.durationSelector = durationSelector;
        }
        DebounceOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
        };
        return DebounceOperator;
    }());
    var DebounceSubscriber = (function (_super) {
        __extends(DebounceSubscriber, _super);
        function DebounceSubscriber(destination, durationSelector) {
            var _this = _super.call(this, destination) || this;
            _this.durationSelector = durationSelector;
            _this.hasValue = false;
            return _this;
        }
        DebounceSubscriber.prototype._next = function (value) {
            try {
                var result = this.durationSelector.call(this, value);
                if (result) {
                    this._tryNext(value, result);
                }
            }
            catch (err) {
                this.destination.error(err);
            }
        };
        DebounceSubscriber.prototype._complete = function () {
            this.emitValue();
            this.destination.complete();
        };
        DebounceSubscriber.prototype._tryNext = function (value, duration) {
            var subscription = this.durationSubscription;
            this.value = value;
            this.hasValue = true;
            if (subscription) {
                subscription.unsubscribe();
                this.remove(subscription);
            }
            subscription = innerSubscribe(duration, new SimpleInnerSubscriber(this));
            if (subscription && !subscription.closed) {
                this.add(this.durationSubscription = subscription);
            }
        };
        DebounceSubscriber.prototype.notifyNext = function () {
            this.emitValue();
        };
        DebounceSubscriber.prototype.notifyComplete = function () {
            this.emitValue();
        };
        DebounceSubscriber.prototype.emitValue = function () {
            if (this.hasValue) {
                var value = this.value;
                var subscription = this.durationSubscription;
                if (subscription) {
                    this.durationSubscription = undefined;
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
                this.value = undefined;
                this.hasValue = false;
                _super.prototype._next.call(this, value);
            }
        };
        return DebounceSubscriber;
    }(SimpleOuterSubscriber));

    function debounceTime(dueTime, scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
    }
    var DebounceTimeOperator = (function () {
        function DebounceTimeOperator(dueTime, scheduler) {
            this.dueTime = dueTime;
            this.scheduler = scheduler;
        }
        DebounceTimeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
        };
        return DebounceTimeOperator;
    }());
    var DebounceTimeSubscriber = (function (_super) {
        __extends(DebounceTimeSubscriber, _super);
        function DebounceTimeSubscriber(destination, dueTime, scheduler) {
            var _this = _super.call(this, destination) || this;
            _this.dueTime = dueTime;
            _this.scheduler = scheduler;
            _this.debouncedSubscription = null;
            _this.lastValue = null;
            _this.hasValue = false;
            return _this;
        }
        DebounceTimeSubscriber.prototype._next = function (value) {
            this.clearDebounce();
            this.lastValue = value;
            this.hasValue = true;
            this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext$2, this.dueTime, this));
        };
        DebounceTimeSubscriber.prototype._complete = function () {
            this.debouncedNext();
            this.destination.complete();
        };
        DebounceTimeSubscriber.prototype.debouncedNext = function () {
            this.clearDebounce();
            if (this.hasValue) {
                var lastValue = this.lastValue;
                this.lastValue = null;
                this.hasValue = false;
                this.destination.next(lastValue);
            }
        };
        DebounceTimeSubscriber.prototype.clearDebounce = function () {
            var debouncedSubscription = this.debouncedSubscription;
            if (debouncedSubscription !== null) {
                this.remove(debouncedSubscription);
                debouncedSubscription.unsubscribe();
                this.debouncedSubscription = null;
            }
        };
        return DebounceTimeSubscriber;
    }(Subscriber));
    function dispatchNext$2(subscriber) {
        subscriber.debouncedNext();
    }

    function defaultIfEmpty(defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return function (source) { return source.lift(new DefaultIfEmptyOperator(defaultValue)); };
    }
    var DefaultIfEmptyOperator = (function () {
        function DefaultIfEmptyOperator(defaultValue) {
            this.defaultValue = defaultValue;
        }
        DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
        };
        return DefaultIfEmptyOperator;
    }());
    var DefaultIfEmptySubscriber = (function (_super) {
        __extends(DefaultIfEmptySubscriber, _super);
        function DefaultIfEmptySubscriber(destination, defaultValue) {
            var _this = _super.call(this, destination) || this;
            _this.defaultValue = defaultValue;
            _this.isEmpty = true;
            return _this;
        }
        DefaultIfEmptySubscriber.prototype._next = function (value) {
            this.isEmpty = false;
            this.destination.next(value);
        };
        DefaultIfEmptySubscriber.prototype._complete = function () {
            if (this.isEmpty) {
                this.destination.next(this.defaultValue);
            }
            this.destination.complete();
        };
        return DefaultIfEmptySubscriber;
    }(Subscriber));

    function isDate(value) {
        return value instanceof Date && !isNaN(+value);
    }

    function delay(delay, scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        var absoluteDelay = isDate(delay);
        var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
        return function (source) { return source.lift(new DelayOperator(delayFor, scheduler)); };
    }
    var DelayOperator = (function () {
        function DelayOperator(delay, scheduler) {
            this.delay = delay;
            this.scheduler = scheduler;
        }
        DelayOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
        };
        return DelayOperator;
    }());
    var DelaySubscriber = (function (_super) {
        __extends(DelaySubscriber, _super);
        function DelaySubscriber(destination, delay, scheduler) {
            var _this = _super.call(this, destination) || this;
            _this.delay = delay;
            _this.scheduler = scheduler;
            _this.queue = [];
            _this.active = false;
            _this.errored = false;
            return _this;
        }
        DelaySubscriber.dispatch = function (state) {
            var source = state.source;
            var queue = source.queue;
            var scheduler = state.scheduler;
            var destination = state.destination;
            while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
                queue.shift().notification.observe(destination);
            }
            if (queue.length > 0) {
                var delay_1 = Math.max(0, queue[0].time - scheduler.now());
                this.schedule(state, delay_1);
            }
            else {
                this.unsubscribe();
                source.active = false;
            }
        };
        DelaySubscriber.prototype._schedule = function (scheduler) {
            this.active = true;
            var destination = this.destination;
            destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
                source: this, destination: this.destination, scheduler: scheduler
            }));
        };
        DelaySubscriber.prototype.scheduleNotification = function (notification) {
            if (this.errored === true) {
                return;
            }
            var scheduler = this.scheduler;
            var message = new DelayMessage(scheduler.now() + this.delay, notification);
            this.queue.push(message);
            if (this.active === false) {
                this._schedule(scheduler);
            }
        };
        DelaySubscriber.prototype._next = function (value) {
            this.scheduleNotification(Notification.createNext(value));
        };
        DelaySubscriber.prototype._error = function (err) {
            this.errored = true;
            this.queue = [];
            this.destination.error(err);
            this.unsubscribe();
        };
        DelaySubscriber.prototype._complete = function () {
            this.scheduleNotification(Notification.createComplete());
            this.unsubscribe();
        };
        return DelaySubscriber;
    }(Subscriber));
    var DelayMessage = (function () {
        function DelayMessage(time, notification) {
            this.time = time;
            this.notification = notification;
        }
        return DelayMessage;
    }());

    function delayWhen(delayDurationSelector, subscriptionDelay) {
        if (subscriptionDelay) {
            return function (source) {
                return new SubscriptionDelayObservable(source, subscriptionDelay)
                    .lift(new DelayWhenOperator(delayDurationSelector));
            };
        }
        return function (source) { return source.lift(new DelayWhenOperator(delayDurationSelector)); };
    }
    var DelayWhenOperator = (function () {
        function DelayWhenOperator(delayDurationSelector) {
            this.delayDurationSelector = delayDurationSelector;
        }
        DelayWhenOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
        };
        return DelayWhenOperator;
    }());
    var DelayWhenSubscriber = (function (_super) {
        __extends(DelayWhenSubscriber, _super);
        function DelayWhenSubscriber(destination, delayDurationSelector) {
            var _this = _super.call(this, destination) || this;
            _this.delayDurationSelector = delayDurationSelector;
            _this.completed = false;
            _this.delayNotifierSubscriptions = [];
            _this.index = 0;
            return _this;
        }
        DelayWhenSubscriber.prototype.notifyNext = function (outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
            this.destination.next(outerValue);
            this.removeSubscription(innerSub);
            this.tryComplete();
        };
        DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
            this._error(error);
        };
        DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
            var value = this.removeSubscription(innerSub);
            if (value) {
                this.destination.next(value);
            }
            this.tryComplete();
        };
        DelayWhenSubscriber.prototype._next = function (value) {
            var index = this.index++;
            try {
                var delayNotifier = this.delayDurationSelector(value, index);
                if (delayNotifier) {
                    this.tryDelay(delayNotifier, value);
                }
            }
            catch (err) {
                this.destination.error(err);
            }
        };
        DelayWhenSubscriber.prototype._complete = function () {
            this.completed = true;
            this.tryComplete();
            this.unsubscribe();
        };
        DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
            subscription.unsubscribe();
            var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
            if (subscriptionIdx !== -1) {
                this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
            }
            return subscription.outerValue;
        };
        DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
            var notifierSubscription = subscribeToResult(this, delayNotifier, value);
            if (notifierSubscription && !notifierSubscription.closed) {
                var destination = this.destination;
                destination.add(notifierSubscription);
                this.delayNotifierSubscriptions.push(notifierSubscription);
            }
        };
        DelayWhenSubscriber.prototype.tryComplete = function () {
            if (this.completed && this.delayNotifierSubscriptions.length === 0) {
                this.destination.complete();
            }
        };
        return DelayWhenSubscriber;
    }(OuterSubscriber));
    var SubscriptionDelayObservable = (function (_super) {
        __extends(SubscriptionDelayObservable, _super);
        function SubscriptionDelayObservable(source, subscriptionDelay) {
            var _this = _super.call(this) || this;
            _this.source = source;
            _this.subscriptionDelay = subscriptionDelay;
            return _this;
        }
        SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
            this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
        };
        return SubscriptionDelayObservable;
    }(Observable));
    var SubscriptionDelaySubscriber = (function (_super) {
        __extends(SubscriptionDelaySubscriber, _super);
        function SubscriptionDelaySubscriber(parent, source) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            _this.source = source;
            _this.sourceSubscribed = false;
            return _this;
        }
        SubscriptionDelaySubscriber.prototype._next = function (unused) {
            this.subscribeToSource();
        };
        SubscriptionDelaySubscriber.prototype._error = function (err) {
            this.unsubscribe();
            this.parent.error(err);
        };
        SubscriptionDelaySubscriber.prototype._complete = function () {
            this.unsubscribe();
            this.subscribeToSource();
        };
        SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
            if (!this.sourceSubscribed) {
                this.sourceSubscribed = true;
                this.unsubscribe();
                this.source.subscribe(this.parent);
            }
        };
        return SubscriptionDelaySubscriber;
    }(Subscriber));

    function dematerialize() {
        return function dematerializeOperatorFunction(source) {
            return source.lift(new DeMaterializeOperator());
        };
    }
    var DeMaterializeOperator = (function () {
        function DeMaterializeOperator() {
        }
        DeMaterializeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DeMaterializeSubscriber(subscriber));
        };
        return DeMaterializeOperator;
    }());
    var DeMaterializeSubscriber = (function (_super) {
        __extends(DeMaterializeSubscriber, _super);
        function DeMaterializeSubscriber(destination) {
            return _super.call(this, destination) || this;
        }
        DeMaterializeSubscriber.prototype._next = function (value) {
            value.observe(this.destination);
        };
        return DeMaterializeSubscriber;
    }(Subscriber));

    function distinct(keySelector, flushes) {
        return function (source) { return source.lift(new DistinctOperator(keySelector, flushes)); };
    }
    var DistinctOperator = (function () {
        function DistinctOperator(keySelector, flushes) {
            this.keySelector = keySelector;
            this.flushes = flushes;
        }
        DistinctOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
        };
        return DistinctOperator;
    }());
    var DistinctSubscriber = (function (_super) {
        __extends(DistinctSubscriber, _super);
        function DistinctSubscriber(destination, keySelector, flushes) {
            var _this = _super.call(this, destination) || this;
            _this.keySelector = keySelector;
            _this.values = new Set();
            if (flushes) {
                _this.add(innerSubscribe(flushes, new SimpleInnerSubscriber(_this)));
            }
            return _this;
        }
        DistinctSubscriber.prototype.notifyNext = function () {
            this.values.clear();
        };
        DistinctSubscriber.prototype.notifyError = function (error) {
            this._error(error);
        };
        DistinctSubscriber.prototype._next = function (value) {
            if (this.keySelector) {
                this._useKeySelector(value);
            }
            else {
                this._finalizeNext(value, value);
            }
        };
        DistinctSubscriber.prototype._useKeySelector = function (value) {
            var key;
            var destination = this.destination;
            try {
                key = this.keySelector(value);
            }
            catch (err) {
                destination.error(err);
                return;
            }
            this._finalizeNext(key, value);
        };
        DistinctSubscriber.prototype._finalizeNext = function (key, value) {
            var values = this.values;
            if (!values.has(key)) {
                values.add(key);
                this.destination.next(value);
            }
        };
        return DistinctSubscriber;
    }(SimpleOuterSubscriber));

    function distinctUntilChanged(compare, keySelector) {
        return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
    }
    var DistinctUntilChangedOperator = (function () {
        function DistinctUntilChangedOperator(compare, keySelector) {
            this.compare = compare;
            this.keySelector = keySelector;
        }
        DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
        };
        return DistinctUntilChangedOperator;
    }());
    var DistinctUntilChangedSubscriber = (function (_super) {
        __extends(DistinctUntilChangedSubscriber, _super);
        function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
            var _this = _super.call(this, destination) || this;
            _this.keySelector = keySelector;
            _this.hasKey = false;
            if (typeof compare === 'function') {
                _this.compare = compare;
            }
            return _this;
        }
        DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
            return x === y;
        };
        DistinctUntilChangedSubscriber.prototype._next = function (value) {
            var key;
            try {
                var keySelector = this.keySelector;
                key = keySelector ? keySelector(value) : value;
            }
            catch (err) {
                return this.destination.error(err);
            }
            var result = false;
            if (this.hasKey) {
                try {
                    var compare = this.compare;
                    result = compare(this.key, key);
                }
                catch (err) {
                    return this.destination.error(err);
                }
            }
            else {
                this.hasKey = true;
            }
            if (!result) {
                this.key = key;
                this.destination.next(value);
            }
        };
        return DistinctUntilChangedSubscriber;
    }(Subscriber));

    function distinctUntilKeyChanged(key, compare) {
        return distinctUntilChanged(function (x, y) { return compare ? compare(x[key], y[key]) : x[key] === y[key]; });
    }

    function throwIfEmpty(errorFactory) {
        if (errorFactory === void 0) { errorFactory = defaultErrorFactory; }
        return function (source) {
            return source.lift(new ThrowIfEmptyOperator(errorFactory));
        };
    }
    var ThrowIfEmptyOperator = (function () {
        function ThrowIfEmptyOperator(errorFactory) {
            this.errorFactory = errorFactory;
        }
        ThrowIfEmptyOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ThrowIfEmptySubscriber(subscriber, this.errorFactory));
        };
        return ThrowIfEmptyOperator;
    }());
    var ThrowIfEmptySubscriber = (function (_super) {
        __extends(ThrowIfEmptySubscriber, _super);
        function ThrowIfEmptySubscriber(destination, errorFactory) {
            var _this = _super.call(this, destination) || this;
            _this.errorFactory = errorFactory;
            _this.hasValue = false;
            return _this;
        }
        ThrowIfEmptySubscriber.prototype._next = function (value) {
            this.hasValue = true;
            this.destination.next(value);
        };
        ThrowIfEmptySubscriber.prototype._complete = function () {
            if (!this.hasValue) {
                var err = void 0;
                try {
                    err = this.errorFactory();
                }
                catch (e) {
                    err = e;
                }
                this.destination.error(err);
            }
            else {
                return this.destination.complete();
            }
        };
        return ThrowIfEmptySubscriber;
    }(Subscriber));
    function defaultErrorFactory() {
        return new EmptyError();
    }

    function take(count) {
        return function (source) {
            if (count === 0) {
                return empty$1();
            }
            else {
                return source.lift(new TakeOperator(count));
            }
        };
    }
    var TakeOperator = (function () {
        function TakeOperator(total) {
            this.total = total;
            if (this.total < 0) {
                throw new ArgumentOutOfRangeError;
            }
        }
        TakeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new TakeSubscriber(subscriber, this.total));
        };
        return TakeOperator;
    }());
    var TakeSubscriber = (function (_super) {
        __extends(TakeSubscriber, _super);
        function TakeSubscriber(destination, total) {
            var _this = _super.call(this, destination) || this;
            _this.total = total;
            _this.count = 0;
            return _this;
        }
        TakeSubscriber.prototype._next = function (value) {
            var total = this.total;
            var count = ++this.count;
            if (count <= total) {
                this.destination.next(value);
                if (count === total) {
                    this.destination.complete();
                    this.unsubscribe();
                }
            }
        };
        return TakeSubscriber;
    }(Subscriber));

    function elementAt(index, defaultValue) {
        if (index < 0) {
            throw new ArgumentOutOfRangeError();
        }
        var hasDefaultValue = arguments.length >= 2;
        return function (source) { return source.pipe(filter(function (v, i) { return i === index; }), take(1), hasDefaultValue
            ? defaultIfEmpty(defaultValue)
            : throwIfEmpty(function () { return new ArgumentOutOfRangeError(); })); };
    }

    function endWith() {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i] = arguments[_i];
        }
        return function (source) { return concat(source, of.apply(void 0, array)); };
    }

    function every(predicate, thisArg) {
        return function (source) { return source.lift(new EveryOperator(predicate, thisArg, source)); };
    }
    var EveryOperator = (function () {
        function EveryOperator(predicate, thisArg, source) {
            this.predicate = predicate;
            this.thisArg = thisArg;
            this.source = source;
        }
        EveryOperator.prototype.call = function (observer, source) {
            return source.subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
        };
        return EveryOperator;
    }());
    var EverySubscriber = (function (_super) {
        __extends(EverySubscriber, _super);
        function EverySubscriber(destination, predicate, thisArg, source) {
            var _this = _super.call(this, destination) || this;
            _this.predicate = predicate;
            _this.thisArg = thisArg;
            _this.source = source;
            _this.index = 0;
            _this.thisArg = thisArg || _this;
            return _this;
        }
        EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
            this.destination.next(everyValueMatch);
            this.destination.complete();
        };
        EverySubscriber.prototype._next = function (value) {
            var result = false;
            try {
                result = this.predicate.call(this.thisArg, value, this.index++, this.source);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            if (!result) {
                this.notifyComplete(false);
            }
        };
        EverySubscriber.prototype._complete = function () {
            this.notifyComplete(true);
        };
        return EverySubscriber;
    }(Subscriber));

    function exhaust() {
        return function (source) { return source.lift(new SwitchFirstOperator()); };
    }
    var SwitchFirstOperator = (function () {
        function SwitchFirstOperator() {
        }
        SwitchFirstOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SwitchFirstSubscriber(subscriber));
        };
        return SwitchFirstOperator;
    }());
    var SwitchFirstSubscriber = (function (_super) {
        __extends(SwitchFirstSubscriber, _super);
        function SwitchFirstSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.hasCompleted = false;
            _this.hasSubscription = false;
            return _this;
        }
        SwitchFirstSubscriber.prototype._next = function (value) {
            if (!this.hasSubscription) {
                this.hasSubscription = true;
                this.add(innerSubscribe(value, new SimpleInnerSubscriber(this)));
            }
        };
        SwitchFirstSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (!this.hasSubscription) {
                this.destination.complete();
            }
        };
        SwitchFirstSubscriber.prototype.notifyComplete = function () {
            this.hasSubscription = false;
            if (this.hasCompleted) {
                this.destination.complete();
            }
        };
        return SwitchFirstSubscriber;
    }(SimpleOuterSubscriber));

    function exhaustMap(project, resultSelector) {
        if (resultSelector) {
            return function (source) { return source.pipe(exhaustMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
        }
        return function (source) {
            return source.lift(new ExhaustMapOperator(project));
        };
    }
    var ExhaustMapOperator = (function () {
        function ExhaustMapOperator(project) {
            this.project = project;
        }
        ExhaustMapOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ExhaustMapSubscriber(subscriber, this.project));
        };
        return ExhaustMapOperator;
    }());
    var ExhaustMapSubscriber = (function (_super) {
        __extends(ExhaustMapSubscriber, _super);
        function ExhaustMapSubscriber(destination, project) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.hasSubscription = false;
            _this.hasCompleted = false;
            _this.index = 0;
            return _this;
        }
        ExhaustMapSubscriber.prototype._next = function (value) {
            if (!this.hasSubscription) {
                this.tryNext(value);
            }
        };
        ExhaustMapSubscriber.prototype.tryNext = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.hasSubscription = true;
            this._innerSub(result);
        };
        ExhaustMapSubscriber.prototype._innerSub = function (result) {
            var innerSubscriber = new SimpleInnerSubscriber(this);
            var destination = this.destination;
            destination.add(innerSubscriber);
            var innerSubscription = innerSubscribe(result, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                destination.add(innerSubscription);
            }
        };
        ExhaustMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (!this.hasSubscription) {
                this.destination.complete();
            }
            this.unsubscribe();
        };
        ExhaustMapSubscriber.prototype.notifyNext = function (innerValue) {
            this.destination.next(innerValue);
        };
        ExhaustMapSubscriber.prototype.notifyError = function (err) {
            this.destination.error(err);
        };
        ExhaustMapSubscriber.prototype.notifyComplete = function () {
            this.hasSubscription = false;
            if (this.hasCompleted) {
                this.destination.complete();
            }
        };
        return ExhaustMapSubscriber;
    }(SimpleOuterSubscriber));

    function expand(project, concurrent, scheduler) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
        return function (source) { return source.lift(new ExpandOperator(project, concurrent, scheduler)); };
    }
    var ExpandOperator = (function () {
        function ExpandOperator(project, concurrent, scheduler) {
            this.project = project;
            this.concurrent = concurrent;
            this.scheduler = scheduler;
        }
        ExpandOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
        };
        return ExpandOperator;
    }());
    var ExpandSubscriber = (function (_super) {
        __extends(ExpandSubscriber, _super);
        function ExpandSubscriber(destination, project, concurrent, scheduler) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.concurrent = concurrent;
            _this.scheduler = scheduler;
            _this.index = 0;
            _this.active = 0;
            _this.hasCompleted = false;
            if (concurrent < Number.POSITIVE_INFINITY) {
                _this.buffer = [];
            }
            return _this;
        }
        ExpandSubscriber.dispatch = function (arg) {
            var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
            subscriber.subscribeToProjection(result, value, index);
        };
        ExpandSubscriber.prototype._next = function (value) {
            var destination = this.destination;
            if (destination.closed) {
                this._complete();
                return;
            }
            var index = this.index++;
            if (this.active < this.concurrent) {
                destination.next(value);
                try {
                    var project = this.project;
                    var result = project(value, index);
                    if (!this.scheduler) {
                        this.subscribeToProjection(result, value, index);
                    }
                    else {
                        var state = { subscriber: this, result: result, value: value, index: index };
                        var destination_1 = this.destination;
                        destination_1.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
                    }
                }
                catch (e) {
                    destination.error(e);
                }
            }
            else {
                this.buffer.push(value);
            }
        };
        ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
            this.active++;
            var destination = this.destination;
            destination.add(innerSubscribe(result, new SimpleInnerSubscriber(this)));
        };
        ExpandSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.hasCompleted && this.active === 0) {
                this.destination.complete();
            }
            this.unsubscribe();
        };
        ExpandSubscriber.prototype.notifyNext = function (innerValue) {
            this._next(innerValue);
        };
        ExpandSubscriber.prototype.notifyComplete = function () {
            var buffer = this.buffer;
            this.active--;
            if (buffer && buffer.length > 0) {
                this._next(buffer.shift());
            }
            if (this.hasCompleted && this.active === 0) {
                this.destination.complete();
            }
        };
        return ExpandSubscriber;
    }(SimpleOuterSubscriber));

    function finalize(callback) {
        return function (source) { return source.lift(new FinallyOperator(callback)); };
    }
    var FinallyOperator = (function () {
        function FinallyOperator(callback) {
            this.callback = callback;
        }
        FinallyOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new FinallySubscriber(subscriber, this.callback));
        };
        return FinallyOperator;
    }());
    var FinallySubscriber = (function (_super) {
        __extends(FinallySubscriber, _super);
        function FinallySubscriber(destination, callback) {
            var _this = _super.call(this, destination) || this;
            _this.add(new Subscription(callback));
            return _this;
        }
        return FinallySubscriber;
    }(Subscriber));

    function find(predicate, thisArg) {
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate is not a function');
        }
        return function (source) { return source.lift(new FindValueOperator(predicate, source, false, thisArg)); };
    }
    var FindValueOperator = (function () {
        function FindValueOperator(predicate, source, yieldIndex, thisArg) {
            this.predicate = predicate;
            this.source = source;
            this.yieldIndex = yieldIndex;
            this.thisArg = thisArg;
        }
        FindValueOperator.prototype.call = function (observer, source) {
            return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
        };
        return FindValueOperator;
    }());
    var FindValueSubscriber = (function (_super) {
        __extends(FindValueSubscriber, _super);
        function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.predicate = predicate;
            _this.source = source;
            _this.yieldIndex = yieldIndex;
            _this.thisArg = thisArg;
            _this.index = 0;
            return _this;
        }
        FindValueSubscriber.prototype.notifyComplete = function (value) {
            var destination = this.destination;
            destination.next(value);
            destination.complete();
            this.unsubscribe();
        };
        FindValueSubscriber.prototype._next = function (value) {
            var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
            var index = this.index++;
            try {
                var result = predicate.call(thisArg || this, value, index, this.source);
                if (result) {
                    this.notifyComplete(this.yieldIndex ? index : value);
                }
            }
            catch (err) {
                this.destination.error(err);
            }
        };
        FindValueSubscriber.prototype._complete = function () {
            this.notifyComplete(this.yieldIndex ? -1 : undefined);
        };
        return FindValueSubscriber;
    }(Subscriber));

    function findIndex(predicate, thisArg) {
        return function (source) { return source.lift(new FindValueOperator(predicate, source, true, thisArg)); };
    }

    function first(predicate, defaultValue) {
        var hasDefaultValue = arguments.length >= 2;
        return function (source) { return source.pipe(predicate ? filter(function (v, i) { return predicate(v, i, source); }) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function () { return new EmptyError(); })); };
    }

    function ignoreElements() {
        return function ignoreElementsOperatorFunction(source) {
            return source.lift(new IgnoreElementsOperator());
        };
    }
    var IgnoreElementsOperator = (function () {
        function IgnoreElementsOperator() {
        }
        IgnoreElementsOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new IgnoreElementsSubscriber(subscriber));
        };
        return IgnoreElementsOperator;
    }());
    var IgnoreElementsSubscriber = (function (_super) {
        __extends(IgnoreElementsSubscriber, _super);
        function IgnoreElementsSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        IgnoreElementsSubscriber.prototype._next = function (unused) {
        };
        return IgnoreElementsSubscriber;
    }(Subscriber));

    function isEmpty() {
        return function (source) { return source.lift(new IsEmptyOperator()); };
    }
    var IsEmptyOperator = (function () {
        function IsEmptyOperator() {
        }
        IsEmptyOperator.prototype.call = function (observer, source) {
            return source.subscribe(new IsEmptySubscriber(observer));
        };
        return IsEmptyOperator;
    }());
    var IsEmptySubscriber = (function (_super) {
        __extends(IsEmptySubscriber, _super);
        function IsEmptySubscriber(destination) {
            return _super.call(this, destination) || this;
        }
        IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
            var destination = this.destination;
            destination.next(isEmpty);
            destination.complete();
        };
        IsEmptySubscriber.prototype._next = function (value) {
            this.notifyComplete(false);
        };
        IsEmptySubscriber.prototype._complete = function () {
            this.notifyComplete(true);
        };
        return IsEmptySubscriber;
    }(Subscriber));

    function takeLast(count) {
        return function takeLastOperatorFunction(source) {
            if (count === 0) {
                return empty$1();
            }
            else {
                return source.lift(new TakeLastOperator(count));
            }
        };
    }
    var TakeLastOperator = (function () {
        function TakeLastOperator(total) {
            this.total = total;
            if (this.total < 0) {
                throw new ArgumentOutOfRangeError;
            }
        }
        TakeLastOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
        };
        return TakeLastOperator;
    }());
    var TakeLastSubscriber = (function (_super) {
        __extends(TakeLastSubscriber, _super);
        function TakeLastSubscriber(destination, total) {
            var _this = _super.call(this, destination) || this;
            _this.total = total;
            _this.ring = new Array();
            _this.count = 0;
            return _this;
        }
        TakeLastSubscriber.prototype._next = function (value) {
            var ring = this.ring;
            var total = this.total;
            var count = this.count++;
            if (ring.length < total) {
                ring.push(value);
            }
            else {
                var index = count % total;
                ring[index] = value;
            }
        };
        TakeLastSubscriber.prototype._complete = function () {
            var destination = this.destination;
            var count = this.count;
            if (count > 0) {
                var total = this.count >= this.total ? this.total : this.count;
                var ring = this.ring;
                for (var i = 0; i < total; i++) {
                    var idx = (count++) % total;
                    destination.next(ring[idx]);
                }
            }
            destination.complete();
        };
        return TakeLastSubscriber;
    }(Subscriber));

    function last(predicate, defaultValue) {
        var hasDefaultValue = arguments.length >= 2;
        return function (source) { return source.pipe(predicate ? filter(function (v, i) { return predicate(v, i, source); }) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function () { return new EmptyError(); })); };
    }

    function mapTo(value) {
        return function (source) { return source.lift(new MapToOperator(value)); };
    }
    var MapToOperator = (function () {
        function MapToOperator(value) {
            this.value = value;
        }
        MapToOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new MapToSubscriber(subscriber, this.value));
        };
        return MapToOperator;
    }());
    var MapToSubscriber = (function (_super) {
        __extends(MapToSubscriber, _super);
        function MapToSubscriber(destination, value) {
            var _this = _super.call(this, destination) || this;
            _this.value = value;
            return _this;
        }
        MapToSubscriber.prototype._next = function (x) {
            this.destination.next(this.value);
        };
        return MapToSubscriber;
    }(Subscriber));

    function materialize() {
        return function materializeOperatorFunction(source) {
            return source.lift(new MaterializeOperator());
        };
    }
    var MaterializeOperator = (function () {
        function MaterializeOperator() {
        }
        MaterializeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new MaterializeSubscriber(subscriber));
        };
        return MaterializeOperator;
    }());
    var MaterializeSubscriber = (function (_super) {
        __extends(MaterializeSubscriber, _super);
        function MaterializeSubscriber(destination) {
            return _super.call(this, destination) || this;
        }
        MaterializeSubscriber.prototype._next = function (value) {
            this.destination.next(Notification.createNext(value));
        };
        MaterializeSubscriber.prototype._error = function (err) {
            var destination = this.destination;
            destination.next(Notification.createError(err));
            destination.complete();
        };
        MaterializeSubscriber.prototype._complete = function () {
            var destination = this.destination;
            destination.next(Notification.createComplete());
            destination.complete();
        };
        return MaterializeSubscriber;
    }(Subscriber));

    function scan(accumulator, seed) {
        var hasSeed = false;
        if (arguments.length >= 2) {
            hasSeed = true;
        }
        return function scanOperatorFunction(source) {
            return source.lift(new ScanOperator(accumulator, seed, hasSeed));
        };
    }
    var ScanOperator = (function () {
        function ScanOperator(accumulator, seed, hasSeed) {
            if (hasSeed === void 0) { hasSeed = false; }
            this.accumulator = accumulator;
            this.seed = seed;
            this.hasSeed = hasSeed;
        }
        ScanOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
        };
        return ScanOperator;
    }());
    var ScanSubscriber = (function (_super) {
        __extends(ScanSubscriber, _super);
        function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
            var _this = _super.call(this, destination) || this;
            _this.accumulator = accumulator;
            _this._seed = _seed;
            _this.hasSeed = hasSeed;
            _this.index = 0;
            return _this;
        }
        Object.defineProperty(ScanSubscriber.prototype, "seed", {
            get: function () {
                return this._seed;
            },
            set: function (value) {
                this.hasSeed = true;
                this._seed = value;
            },
            enumerable: true,
            configurable: true
        });
        ScanSubscriber.prototype._next = function (value) {
            if (!this.hasSeed) {
                this.seed = value;
                this.destination.next(value);
            }
            else {
                return this._tryNext(value);
            }
        };
        ScanSubscriber.prototype._tryNext = function (value) {
            var index = this.index++;
            var result;
            try {
                result = this.accumulator(this.seed, value, index);
            }
            catch (err) {
                this.destination.error(err);
            }
            this.seed = result;
            this.destination.next(result);
        };
        return ScanSubscriber;
    }(Subscriber));

    function reduce(accumulator, seed) {
        if (arguments.length >= 2) {
            return function reduceOperatorFunctionWithSeed(source) {
                return pipe(scan(accumulator, seed), takeLast(1), defaultIfEmpty(seed))(source);
            };
        }
        return function reduceOperatorFunction(source) {
            return pipe(scan(function (acc, value, index) { return accumulator(acc, value, index + 1); }), takeLast(1))(source);
        };
    }

    function max(comparer) {
        var max = (typeof comparer === 'function')
            ? function (x, y) { return comparer(x, y) > 0 ? x : y; }
            : function (x, y) { return x > y ? x : y; };
        return reduce(max);
    }

    function merge$1() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        return function (source) { return source.lift.call(merge.apply(void 0, [source].concat(observables))); };
    }

    function mergeMapTo(innerObservable, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        if (typeof resultSelector === 'function') {
            return mergeMap(function () { return innerObservable; }, resultSelector, concurrent);
        }
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
        }
        return mergeMap(function () { return innerObservable; }, concurrent);
    }

    function mergeScan(accumulator, seed, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        return function (source) { return source.lift(new MergeScanOperator(accumulator, seed, concurrent)); };
    }
    var MergeScanOperator = (function () {
        function MergeScanOperator(accumulator, seed, concurrent) {
            this.accumulator = accumulator;
            this.seed = seed;
            this.concurrent = concurrent;
        }
        MergeScanOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
        };
        return MergeScanOperator;
    }());
    var MergeScanSubscriber = (function (_super) {
        __extends(MergeScanSubscriber, _super);
        function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
            var _this = _super.call(this, destination) || this;
            _this.accumulator = accumulator;
            _this.acc = acc;
            _this.concurrent = concurrent;
            _this.hasValue = false;
            _this.hasCompleted = false;
            _this.buffer = [];
            _this.active = 0;
            _this.index = 0;
            return _this;
        }
        MergeScanSubscriber.prototype._next = function (value) {
            if (this.active < this.concurrent) {
                var index = this.index++;
                var destination = this.destination;
                var ish = void 0;
                try {
                    var accumulator = this.accumulator;
                    ish = accumulator(this.acc, value, index);
                }
                catch (e) {
                    return destination.error(e);
                }
                this.active++;
                this._innerSub(ish);
            }
            else {
                this.buffer.push(value);
            }
        };
        MergeScanSubscriber.prototype._innerSub = function (ish) {
            var innerSubscriber = new SimpleInnerSubscriber(this);
            var destination = this.destination;
            destination.add(innerSubscriber);
            var innerSubscription = innerSubscribe(ish, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                destination.add(innerSubscription);
            }
        };
        MergeScanSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                if (this.hasValue === false) {
                    this.destination.next(this.acc);
                }
                this.destination.complete();
            }
            this.unsubscribe();
        };
        MergeScanSubscriber.prototype.notifyNext = function (innerValue) {
            var destination = this.destination;
            this.acc = innerValue;
            this.hasValue = true;
            destination.next(innerValue);
        };
        MergeScanSubscriber.prototype.notifyComplete = function () {
            var buffer = this.buffer;
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            }
            else if (this.active === 0 && this.hasCompleted) {
                if (this.hasValue === false) {
                    this.destination.next(this.acc);
                }
                this.destination.complete();
            }
        };
        return MergeScanSubscriber;
    }(SimpleOuterSubscriber));

    function min(comparer) {
        var min = (typeof comparer === 'function')
            ? function (x, y) { return comparer(x, y) < 0 ? x : y; }
            : function (x, y) { return x < y ? x : y; };
        return reduce(min);
    }

    function multicast(subjectOrSubjectFactory, selector) {
        return function multicastOperatorFunction(source) {
            var subjectFactory;
            if (typeof subjectOrSubjectFactory === 'function') {
                subjectFactory = subjectOrSubjectFactory;
            }
            else {
                subjectFactory = function subjectFactory() {
                    return subjectOrSubjectFactory;
                };
            }
            if (typeof selector === 'function') {
                return source.lift(new MulticastOperator(subjectFactory, selector));
            }
            var connectable = Object.create(source, connectableObservableDescriptor);
            connectable.source = source;
            connectable.subjectFactory = subjectFactory;
            return connectable;
        };
    }
    var MulticastOperator = (function () {
        function MulticastOperator(subjectFactory, selector) {
            this.subjectFactory = subjectFactory;
            this.selector = selector;
        }
        MulticastOperator.prototype.call = function (subscriber, source) {
            var selector = this.selector;
            var subject = this.subjectFactory();
            var subscription = selector(subject).subscribe(subscriber);
            subscription.add(source.subscribe(subject));
            return subscription;
        };
        return MulticastOperator;
    }());

    function onErrorResumeNext$1() {
        var nextSources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nextSources[_i] = arguments[_i];
        }
        if (nextSources.length === 1 && isArray(nextSources[0])) {
            nextSources = nextSources[0];
        }
        return function (source) { return source.lift(new OnErrorResumeNextOperator(nextSources)); };
    }
    var OnErrorResumeNextOperator = (function () {
        function OnErrorResumeNextOperator(nextSources) {
            this.nextSources = nextSources;
        }
        OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
        };
        return OnErrorResumeNextOperator;
    }());
    var OnErrorResumeNextSubscriber = (function (_super) {
        __extends(OnErrorResumeNextSubscriber, _super);
        function OnErrorResumeNextSubscriber(destination, nextSources) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            _this.nextSources = nextSources;
            return _this;
        }
        OnErrorResumeNextSubscriber.prototype.notifyError = function () {
            this.subscribeToNextSource();
        };
        OnErrorResumeNextSubscriber.prototype.notifyComplete = function () {
            this.subscribeToNextSource();
        };
        OnErrorResumeNextSubscriber.prototype._error = function (err) {
            this.subscribeToNextSource();
            this.unsubscribe();
        };
        OnErrorResumeNextSubscriber.prototype._complete = function () {
            this.subscribeToNextSource();
            this.unsubscribe();
        };
        OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
            var next = this.nextSources.shift();
            if (!!next) {
                var innerSubscriber = new SimpleInnerSubscriber(this);
                var destination = this.destination;
                destination.add(innerSubscriber);
                var innerSubscription = innerSubscribe(next, innerSubscriber);
                if (innerSubscription !== innerSubscriber) {
                    destination.add(innerSubscription);
                }
            }
            else {
                this.destination.complete();
            }
        };
        return OnErrorResumeNextSubscriber;
    }(SimpleOuterSubscriber));

    function pairwise() {
        return function (source) { return source.lift(new PairwiseOperator()); };
    }
    var PairwiseOperator = (function () {
        function PairwiseOperator() {
        }
        PairwiseOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new PairwiseSubscriber(subscriber));
        };
        return PairwiseOperator;
    }());
    var PairwiseSubscriber = (function (_super) {
        __extends(PairwiseSubscriber, _super);
        function PairwiseSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.hasPrev = false;
            return _this;
        }
        PairwiseSubscriber.prototype._next = function (value) {
            var pair;
            if (this.hasPrev) {
                pair = [this.prev, value];
            }
            else {
                this.hasPrev = true;
            }
            this.prev = value;
            if (pair) {
                this.destination.next(pair);
            }
        };
        return PairwiseSubscriber;
    }(Subscriber));

    function partition$1(predicate, thisArg) {
        return function (source) { return [
            filter(predicate, thisArg)(source),
            filter(not(predicate, thisArg))(source)
        ]; };
    }

    function pluck() {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        var length = properties.length;
        if (length === 0) {
            throw new Error('list of properties cannot be empty.');
        }
        return function (source) { return map(plucker(properties, length))(source); };
    }
    function plucker(props, length) {
        var mapper = function (x) {
            var currentProp = x;
            for (var i = 0; i < length; i++) {
                var p = currentProp != null ? currentProp[props[i]] : undefined;
                if (p !== void 0) {
                    currentProp = p;
                }
                else {
                    return undefined;
                }
            }
            return currentProp;
        };
        return mapper;
    }

    function publish(selector) {
        return selector ?
            multicast(function () { return new Subject(); }, selector) :
            multicast(new Subject());
    }

    function publishBehavior(value) {
        return function (source) { return multicast(new BehaviorSubject(value))(source); };
    }

    function publishLast() {
        return function (source) { return multicast(new AsyncSubject())(source); };
    }

    function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
        if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
            scheduler = selectorOrScheduler;
        }
        var selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
        var subject = new ReplaySubject(bufferSize, windowTime, scheduler);
        return function (source) { return multicast(function () { return subject; }, selector)(source); };
    }

    function race$1() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        return function raceOperatorFunction(source) {
            if (observables.length === 1 && isArray(observables[0])) {
                observables = observables[0];
            }
            return source.lift.call(race.apply(void 0, [source].concat(observables)));
        };
    }

    function repeat(count) {
        if (count === void 0) { count = -1; }
        return function (source) {
            if (count === 0) {
                return empty$1();
            }
            else if (count < 0) {
                return source.lift(new RepeatOperator(-1, source));
            }
            else {
                return source.lift(new RepeatOperator(count - 1, source));
            }
        };
    }
    var RepeatOperator = (function () {
        function RepeatOperator(count, source) {
            this.count = count;
            this.source = source;
        }
        RepeatOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
        };
        return RepeatOperator;
    }());
    var RepeatSubscriber = (function (_super) {
        __extends(RepeatSubscriber, _super);
        function RepeatSubscriber(destination, count, source) {
            var _this = _super.call(this, destination) || this;
            _this.count = count;
            _this.source = source;
            return _this;
        }
        RepeatSubscriber.prototype.complete = function () {
            if (!this.isStopped) {
                var _a = this, source = _a.source, count = _a.count;
                if (count === 0) {
                    return _super.prototype.complete.call(this);
                }
                else if (count > -1) {
                    this.count = count - 1;
                }
                source.subscribe(this._unsubscribeAndRecycle());
            }
        };
        return RepeatSubscriber;
    }(Subscriber));

    function repeatWhen(notifier) {
        return function (source) { return source.lift(new RepeatWhenOperator(notifier)); };
    }
    var RepeatWhenOperator = (function () {
        function RepeatWhenOperator(notifier) {
            this.notifier = notifier;
        }
        RepeatWhenOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
        };
        return RepeatWhenOperator;
    }());
    var RepeatWhenSubscriber = (function (_super) {
        __extends(RepeatWhenSubscriber, _super);
        function RepeatWhenSubscriber(destination, notifier, source) {
            var _this = _super.call(this, destination) || this;
            _this.notifier = notifier;
            _this.source = source;
            _this.sourceIsBeingSubscribedTo = true;
            return _this;
        }
        RepeatWhenSubscriber.prototype.notifyNext = function () {
            this.sourceIsBeingSubscribedTo = true;
            this.source.subscribe(this);
        };
        RepeatWhenSubscriber.prototype.notifyComplete = function () {
            if (this.sourceIsBeingSubscribedTo === false) {
                return _super.prototype.complete.call(this);
            }
        };
        RepeatWhenSubscriber.prototype.complete = function () {
            this.sourceIsBeingSubscribedTo = false;
            if (!this.isStopped) {
                if (!this.retries) {
                    this.subscribeToRetries();
                }
                if (!this.retriesSubscription || this.retriesSubscription.closed) {
                    return _super.prototype.complete.call(this);
                }
                this._unsubscribeAndRecycle();
                this.notifications.next(undefined);
            }
        };
        RepeatWhenSubscriber.prototype._unsubscribe = function () {
            var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
            if (notifications) {
                notifications.unsubscribe();
                this.notifications = undefined;
            }
            if (retriesSubscription) {
                retriesSubscription.unsubscribe();
                this.retriesSubscription = undefined;
            }
            this.retries = undefined;
        };
        RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
            var _unsubscribe = this._unsubscribe;
            this._unsubscribe = null;
            _super.prototype._unsubscribeAndRecycle.call(this);
            this._unsubscribe = _unsubscribe;
            return this;
        };
        RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
            this.notifications = new Subject();
            var retries;
            try {
                var notifier = this.notifier;
                retries = notifier(this.notifications);
            }
            catch (e) {
                return _super.prototype.complete.call(this);
            }
            this.retries = retries;
            this.retriesSubscription = innerSubscribe(retries, new SimpleInnerSubscriber(this));
        };
        return RepeatWhenSubscriber;
    }(SimpleOuterSubscriber));

    function retry(count) {
        if (count === void 0) { count = -1; }
        return function (source) { return source.lift(new RetryOperator(count, source)); };
    }
    var RetryOperator = (function () {
        function RetryOperator(count, source) {
            this.count = count;
            this.source = source;
        }
        RetryOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
        };
        return RetryOperator;
    }());
    var RetrySubscriber = (function (_super) {
        __extends(RetrySubscriber, _super);
        function RetrySubscriber(destination, count, source) {
            var _this = _super.call(this, destination) || this;
            _this.count = count;
            _this.source = source;
            return _this;
        }
        RetrySubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _a = this, source = _a.source, count = _a.count;
                if (count === 0) {
                    return _super.prototype.error.call(this, err);
                }
                else if (count > -1) {
                    this.count = count - 1;
                }
                source.subscribe(this._unsubscribeAndRecycle());
            }
        };
        return RetrySubscriber;
    }(Subscriber));

    function retryWhen(notifier) {
        return function (source) { return source.lift(new RetryWhenOperator(notifier, source)); };
    }
    var RetryWhenOperator = (function () {
        function RetryWhenOperator(notifier, source) {
            this.notifier = notifier;
            this.source = source;
        }
        RetryWhenOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
        };
        return RetryWhenOperator;
    }());
    var RetryWhenSubscriber = (function (_super) {
        __extends(RetryWhenSubscriber, _super);
        function RetryWhenSubscriber(destination, notifier, source) {
            var _this = _super.call(this, destination) || this;
            _this.notifier = notifier;
            _this.source = source;
            return _this;
        }
        RetryWhenSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var errors = this.errors;
                var retries = this.retries;
                var retriesSubscription = this.retriesSubscription;
                if (!retries) {
                    errors = new Subject();
                    try {
                        var notifier = this.notifier;
                        retries = notifier(errors);
                    }
                    catch (e) {
                        return _super.prototype.error.call(this, e);
                    }
                    retriesSubscription = innerSubscribe(retries, new SimpleInnerSubscriber(this));
                }
                else {
                    this.errors = undefined;
                    this.retriesSubscription = undefined;
                }
                this._unsubscribeAndRecycle();
                this.errors = errors;
                this.retries = retries;
                this.retriesSubscription = retriesSubscription;
                errors.next(err);
            }
        };
        RetryWhenSubscriber.prototype._unsubscribe = function () {
            var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
            if (errors) {
                errors.unsubscribe();
                this.errors = undefined;
            }
            if (retriesSubscription) {
                retriesSubscription.unsubscribe();
                this.retriesSubscription = undefined;
            }
            this.retries = undefined;
        };
        RetryWhenSubscriber.prototype.notifyNext = function () {
            var _unsubscribe = this._unsubscribe;
            this._unsubscribe = null;
            this._unsubscribeAndRecycle();
            this._unsubscribe = _unsubscribe;
            this.source.subscribe(this);
        };
        return RetryWhenSubscriber;
    }(SimpleOuterSubscriber));

    function sample(notifier) {
        return function (source) { return source.lift(new SampleOperator(notifier)); };
    }
    var SampleOperator = (function () {
        function SampleOperator(notifier) {
            this.notifier = notifier;
        }
        SampleOperator.prototype.call = function (subscriber, source) {
            var sampleSubscriber = new SampleSubscriber(subscriber);
            var subscription = source.subscribe(sampleSubscriber);
            subscription.add(innerSubscribe(this.notifier, new SimpleInnerSubscriber(sampleSubscriber)));
            return subscription;
        };
        return SampleOperator;
    }());
    var SampleSubscriber = (function (_super) {
        __extends(SampleSubscriber, _super);
        function SampleSubscriber() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.hasValue = false;
            return _this;
        }
        SampleSubscriber.prototype._next = function (value) {
            this.value = value;
            this.hasValue = true;
        };
        SampleSubscriber.prototype.notifyNext = function () {
            this.emitValue();
        };
        SampleSubscriber.prototype.notifyComplete = function () {
            this.emitValue();
        };
        SampleSubscriber.prototype.emitValue = function () {
            if (this.hasValue) {
                this.hasValue = false;
                this.destination.next(this.value);
            }
        };
        return SampleSubscriber;
    }(SimpleOuterSubscriber));

    function sampleTime(period, scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        return function (source) { return source.lift(new SampleTimeOperator(period, scheduler)); };
    }
    var SampleTimeOperator = (function () {
        function SampleTimeOperator(period, scheduler) {
            this.period = period;
            this.scheduler = scheduler;
        }
        SampleTimeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
        };
        return SampleTimeOperator;
    }());
    var SampleTimeSubscriber = (function (_super) {
        __extends(SampleTimeSubscriber, _super);
        function SampleTimeSubscriber(destination, period, scheduler) {
            var _this = _super.call(this, destination) || this;
            _this.period = period;
            _this.scheduler = scheduler;
            _this.hasValue = false;
            _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
            return _this;
        }
        SampleTimeSubscriber.prototype._next = function (value) {
            this.lastValue = value;
            this.hasValue = true;
        };
        SampleTimeSubscriber.prototype.notifyNext = function () {
            if (this.hasValue) {
                this.hasValue = false;
                this.destination.next(this.lastValue);
            }
        };
        return SampleTimeSubscriber;
    }(Subscriber));
    function dispatchNotification(state) {
        var subscriber = state.subscriber, period = state.period;
        subscriber.notifyNext();
        this.schedule(state, period);
    }

    function sequenceEqual(compareTo, comparator) {
        return function (source) { return source.lift(new SequenceEqualOperator(compareTo, comparator)); };
    }
    var SequenceEqualOperator = (function () {
        function SequenceEqualOperator(compareTo, comparator) {
            this.compareTo = compareTo;
            this.comparator = comparator;
        }
        SequenceEqualOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparator));
        };
        return SequenceEqualOperator;
    }());
    var SequenceEqualSubscriber = (function (_super) {
        __extends(SequenceEqualSubscriber, _super);
        function SequenceEqualSubscriber(destination, compareTo, comparator) {
            var _this = _super.call(this, destination) || this;
            _this.compareTo = compareTo;
            _this.comparator = comparator;
            _this._a = [];
            _this._b = [];
            _this._oneComplete = false;
            _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
            return _this;
        }
        SequenceEqualSubscriber.prototype._next = function (value) {
            if (this._oneComplete && this._b.length === 0) {
                this.emit(false);
            }
            else {
                this._a.push(value);
                this.checkValues();
            }
        };
        SequenceEqualSubscriber.prototype._complete = function () {
            if (this._oneComplete) {
                this.emit(this._a.length === 0 && this._b.length === 0);
            }
            else {
                this._oneComplete = true;
            }
            this.unsubscribe();
        };
        SequenceEqualSubscriber.prototype.checkValues = function () {
            var _c = this, _a = _c._a, _b = _c._b, comparator = _c.comparator;
            while (_a.length > 0 && _b.length > 0) {
                var a = _a.shift();
                var b = _b.shift();
                var areEqual = false;
                try {
                    areEqual = comparator ? comparator(a, b) : a === b;
                }
                catch (e) {
                    this.destination.error(e);
                }
                if (!areEqual) {
                    this.emit(false);
                }
            }
        };
        SequenceEqualSubscriber.prototype.emit = function (value) {
            var destination = this.destination;
            destination.next(value);
            destination.complete();
        };
        SequenceEqualSubscriber.prototype.nextB = function (value) {
            if (this._oneComplete && this._a.length === 0) {
                this.emit(false);
            }
            else {
                this._b.push(value);
                this.checkValues();
            }
        };
        SequenceEqualSubscriber.prototype.completeB = function () {
            if (this._oneComplete) {
                this.emit(this._a.length === 0 && this._b.length === 0);
            }
            else {
                this._oneComplete = true;
            }
        };
        return SequenceEqualSubscriber;
    }(Subscriber));
    var SequenceEqualCompareToSubscriber = (function (_super) {
        __extends(SequenceEqualCompareToSubscriber, _super);
        function SequenceEqualCompareToSubscriber(destination, parent) {
            var _this = _super.call(this, destination) || this;
            _this.parent = parent;
            return _this;
        }
        SequenceEqualCompareToSubscriber.prototype._next = function (value) {
            this.parent.nextB(value);
        };
        SequenceEqualCompareToSubscriber.prototype._error = function (err) {
            this.parent.error(err);
            this.unsubscribe();
        };
        SequenceEqualCompareToSubscriber.prototype._complete = function () {
            this.parent.completeB();
            this.unsubscribe();
        };
        return SequenceEqualCompareToSubscriber;
    }(Subscriber));

    function shareSubjectFactory() {
        return new Subject();
    }
    function share() {
        return function (source) { return refCount()(multicast(shareSubjectFactory)(source)); };
    }

    function shareReplay(configOrBufferSize, windowTime, scheduler) {
        var config;
        if (configOrBufferSize && typeof configOrBufferSize === 'object') {
            config = configOrBufferSize;
        }
        else {
            config = {
                bufferSize: configOrBufferSize,
                windowTime: windowTime,
                refCount: false,
                scheduler: scheduler
            };
        }
        return function (source) { return source.lift(shareReplayOperator(config)); };
    }
    function shareReplayOperator(_a) {
        var _b = _a.bufferSize, bufferSize = _b === void 0 ? Number.POSITIVE_INFINITY : _b, _c = _a.windowTime, windowTime = _c === void 0 ? Number.POSITIVE_INFINITY : _c, useRefCount = _a.refCount, scheduler = _a.scheduler;
        var subject;
        var refCount = 0;
        var subscription;
        var hasError = false;
        var isComplete = false;
        return function shareReplayOperation(source) {
            refCount++;
            var innerSub;
            if (!subject || hasError) {
                hasError = false;
                subject = new ReplaySubject(bufferSize, windowTime, scheduler);
                innerSub = subject.subscribe(this);
                subscription = source.subscribe({
                    next: function (value) { subject.next(value); },
                    error: function (err) {
                        hasError = true;
                        subject.error(err);
                    },
                    complete: function () {
                        isComplete = true;
                        subscription = undefined;
                        subject.complete();
                    },
                });
            }
            else {
                innerSub = subject.subscribe(this);
            }
            this.add(function () {
                refCount--;
                innerSub.unsubscribe();
                if (subscription && !isComplete && useRefCount && refCount === 0) {
                    subscription.unsubscribe();
                    subscription = undefined;
                    subject = undefined;
                }
            });
        };
    }

    function single(predicate) {
        return function (source) { return source.lift(new SingleOperator(predicate, source)); };
    }
    var SingleOperator = (function () {
        function SingleOperator(predicate, source) {
            this.predicate = predicate;
            this.source = source;
        }
        SingleOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
        };
        return SingleOperator;
    }());
    var SingleSubscriber = (function (_super) {
        __extends(SingleSubscriber, _super);
        function SingleSubscriber(destination, predicate, source) {
            var _this = _super.call(this, destination) || this;
            _this.predicate = predicate;
            _this.source = source;
            _this.seenValue = false;
            _this.index = 0;
            return _this;
        }
        SingleSubscriber.prototype.applySingleValue = function (value) {
            if (this.seenValue) {
                this.destination.error('Sequence contains more than one element');
            }
            else {
                this.seenValue = true;
                this.singleValue = value;
            }
        };
        SingleSubscriber.prototype._next = function (value) {
            var index = this.index++;
            if (this.predicate) {
                this.tryNext(value, index);
            }
            else {
                this.applySingleValue(value);
            }
        };
        SingleSubscriber.prototype.tryNext = function (value, index) {
            try {
                if (this.predicate(value, index, this.source)) {
                    this.applySingleValue(value);
                }
            }
            catch (err) {
                this.destination.error(err);
            }
        };
        SingleSubscriber.prototype._complete = function () {
            var destination = this.destination;
            if (this.index > 0) {
                destination.next(this.seenValue ? this.singleValue : undefined);
                destination.complete();
            }
            else {
                destination.error(new EmptyError);
            }
        };
        return SingleSubscriber;
    }(Subscriber));

    function skip(count) {
        return function (source) { return source.lift(new SkipOperator(count)); };
    }
    var SkipOperator = (function () {
        function SkipOperator(total) {
            this.total = total;
        }
        SkipOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SkipSubscriber(subscriber, this.total));
        };
        return SkipOperator;
    }());
    var SkipSubscriber = (function (_super) {
        __extends(SkipSubscriber, _super);
        function SkipSubscriber(destination, total) {
            var _this = _super.call(this, destination) || this;
            _this.total = total;
            _this.count = 0;
            return _this;
        }
        SkipSubscriber.prototype._next = function (x) {
            if (++this.count > this.total) {
                this.destination.next(x);
            }
        };
        return SkipSubscriber;
    }(Subscriber));

    function skipLast(count) {
        return function (source) { return source.lift(new SkipLastOperator(count)); };
    }
    var SkipLastOperator = (function () {
        function SkipLastOperator(_skipCount) {
            this._skipCount = _skipCount;
            if (this._skipCount < 0) {
                throw new ArgumentOutOfRangeError;
            }
        }
        SkipLastOperator.prototype.call = function (subscriber, source) {
            if (this._skipCount === 0) {
                return source.subscribe(new Subscriber(subscriber));
            }
            else {
                return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
            }
        };
        return SkipLastOperator;
    }());
    var SkipLastSubscriber = (function (_super) {
        __extends(SkipLastSubscriber, _super);
        function SkipLastSubscriber(destination, _skipCount) {
            var _this = _super.call(this, destination) || this;
            _this._skipCount = _skipCount;
            _this._count = 0;
            _this._ring = new Array(_skipCount);
            return _this;
        }
        SkipLastSubscriber.prototype._next = function (value) {
            var skipCount = this._skipCount;
            var count = this._count++;
            if (count < skipCount) {
                this._ring[count] = value;
            }
            else {
                var currentIndex = count % skipCount;
                var ring = this._ring;
                var oldValue = ring[currentIndex];
                ring[currentIndex] = value;
                this.destination.next(oldValue);
            }
        };
        return SkipLastSubscriber;
    }(Subscriber));

    function skipUntil(notifier) {
        return function (source) { return source.lift(new SkipUntilOperator(notifier)); };
    }
    var SkipUntilOperator = (function () {
        function SkipUntilOperator(notifier) {
            this.notifier = notifier;
        }
        SkipUntilOperator.prototype.call = function (destination, source) {
            return source.subscribe(new SkipUntilSubscriber(destination, this.notifier));
        };
        return SkipUntilOperator;
    }());
    var SkipUntilSubscriber = (function (_super) {
        __extends(SkipUntilSubscriber, _super);
        function SkipUntilSubscriber(destination, notifier) {
            var _this = _super.call(this, destination) || this;
            _this.hasValue = false;
            var innerSubscriber = new SimpleInnerSubscriber(_this);
            _this.add(innerSubscriber);
            _this.innerSubscription = innerSubscriber;
            var innerSubscription = innerSubscribe(notifier, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                _this.add(innerSubscription);
                _this.innerSubscription = innerSubscription;
            }
            return _this;
        }
        SkipUntilSubscriber.prototype._next = function (value) {
            if (this.hasValue) {
                _super.prototype._next.call(this, value);
            }
        };
        SkipUntilSubscriber.prototype.notifyNext = function () {
            this.hasValue = true;
            if (this.innerSubscription) {
                this.innerSubscription.unsubscribe();
            }
        };
        SkipUntilSubscriber.prototype.notifyComplete = function () {
        };
        return SkipUntilSubscriber;
    }(SimpleOuterSubscriber));

    function skipWhile(predicate) {
        return function (source) { return source.lift(new SkipWhileOperator(predicate)); };
    }
    var SkipWhileOperator = (function () {
        function SkipWhileOperator(predicate) {
            this.predicate = predicate;
        }
        SkipWhileOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
        };
        return SkipWhileOperator;
    }());
    var SkipWhileSubscriber = (function (_super) {
        __extends(SkipWhileSubscriber, _super);
        function SkipWhileSubscriber(destination, predicate) {
            var _this = _super.call(this, destination) || this;
            _this.predicate = predicate;
            _this.skipping = true;
            _this.index = 0;
            return _this;
        }
        SkipWhileSubscriber.prototype._next = function (value) {
            var destination = this.destination;
            if (this.skipping) {
                this.tryCallPredicate(value);
            }
            if (!this.skipping) {
                destination.next(value);
            }
        };
        SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
            try {
                var result = this.predicate(value, this.index++);
                this.skipping = Boolean(result);
            }
            catch (err) {
                this.destination.error(err);
            }
        };
        return SkipWhileSubscriber;
    }(Subscriber));

    function startWith() {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler(scheduler)) {
            array.pop();
            return function (source) { return concat(array, source, scheduler); };
        }
        else {
            return function (source) { return concat(array, source); };
        }
    }

    var SubscribeOnObservable = (function (_super) {
        __extends(SubscribeOnObservable, _super);
        function SubscribeOnObservable(source, delayTime, scheduler) {
            if (delayTime === void 0) { delayTime = 0; }
            if (scheduler === void 0) { scheduler = asap; }
            var _this = _super.call(this) || this;
            _this.source = source;
            _this.delayTime = delayTime;
            _this.scheduler = scheduler;
            if (!isNumeric(delayTime) || delayTime < 0) {
                _this.delayTime = 0;
            }
            if (!scheduler || typeof scheduler.schedule !== 'function') {
                _this.scheduler = asap;
            }
            return _this;
        }
        SubscribeOnObservable.create = function (source, delay, scheduler) {
            if (delay === void 0) { delay = 0; }
            if (scheduler === void 0) { scheduler = asap; }
            return new SubscribeOnObservable(source, delay, scheduler);
        };
        SubscribeOnObservable.dispatch = function (arg) {
            var source = arg.source, subscriber = arg.subscriber;
            return this.add(source.subscribe(subscriber));
        };
        SubscribeOnObservable.prototype._subscribe = function (subscriber) {
            var delay = this.delayTime;
            var source = this.source;
            var scheduler = this.scheduler;
            return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
                source: source, subscriber: subscriber
            });
        };
        return SubscribeOnObservable;
    }(Observable));

    function subscribeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return function subscribeOnOperatorFunction(source) {
            return source.lift(new SubscribeOnOperator(scheduler, delay));
        };
    }
    var SubscribeOnOperator = (function () {
        function SubscribeOnOperator(scheduler, delay) {
            this.scheduler = scheduler;
            this.delay = delay;
        }
        SubscribeOnOperator.prototype.call = function (subscriber, source) {
            return new SubscribeOnObservable(source, this.delay, this.scheduler).subscribe(subscriber);
        };
        return SubscribeOnOperator;
    }());

    function switchMap(project, resultSelector) {
        if (typeof resultSelector === 'function') {
            return function (source) { return source.pipe(switchMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
        }
        return function (source) { return source.lift(new SwitchMapOperator(project)); };
    }
    var SwitchMapOperator = (function () {
        function SwitchMapOperator(project) {
            this.project = project;
        }
        SwitchMapOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
        };
        return SwitchMapOperator;
    }());
    var SwitchMapSubscriber = (function (_super) {
        __extends(SwitchMapSubscriber, _super);
        function SwitchMapSubscriber(destination, project) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.index = 0;
            return _this;
        }
        SwitchMapSubscriber.prototype._next = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            }
            catch (error) {
                this.destination.error(error);
                return;
            }
            this._innerSub(result);
        };
        SwitchMapSubscriber.prototype._innerSub = function (result) {
            var innerSubscription = this.innerSubscription;
            if (innerSubscription) {
                innerSubscription.unsubscribe();
            }
            var innerSubscriber = new SimpleInnerSubscriber(this);
            var destination = this.destination;
            destination.add(innerSubscriber);
            this.innerSubscription = innerSubscribe(result, innerSubscriber);
            if (this.innerSubscription !== innerSubscriber) {
                destination.add(this.innerSubscription);
            }
        };
        SwitchMapSubscriber.prototype._complete = function () {
            var innerSubscription = this.innerSubscription;
            if (!innerSubscription || innerSubscription.closed) {
                _super.prototype._complete.call(this);
            }
            this.unsubscribe();
        };
        SwitchMapSubscriber.prototype._unsubscribe = function () {
            this.innerSubscription = undefined;
        };
        SwitchMapSubscriber.prototype.notifyComplete = function () {
            this.innerSubscription = undefined;
            if (this.isStopped) {
                _super.prototype._complete.call(this);
            }
        };
        SwitchMapSubscriber.prototype.notifyNext = function (innerValue) {
            this.destination.next(innerValue);
        };
        return SwitchMapSubscriber;
    }(SimpleOuterSubscriber));

    function switchAll() {
        return switchMap(identity);
    }

    function switchMapTo(innerObservable, resultSelector) {
        return resultSelector ? switchMap(function () { return innerObservable; }, resultSelector) : switchMap(function () { return innerObservable; });
    }

    function takeUntil(notifier) {
        return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
    }
    var TakeUntilOperator = (function () {
        function TakeUntilOperator(notifier) {
            this.notifier = notifier;
        }
        TakeUntilOperator.prototype.call = function (subscriber, source) {
            var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
            var notifierSubscription = innerSubscribe(this.notifier, new SimpleInnerSubscriber(takeUntilSubscriber));
            if (notifierSubscription && !takeUntilSubscriber.seenValue) {
                takeUntilSubscriber.add(notifierSubscription);
                return source.subscribe(takeUntilSubscriber);
            }
            return takeUntilSubscriber;
        };
        return TakeUntilOperator;
    }());
    var TakeUntilSubscriber = (function (_super) {
        __extends(TakeUntilSubscriber, _super);
        function TakeUntilSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.seenValue = false;
            return _this;
        }
        TakeUntilSubscriber.prototype.notifyNext = function () {
            this.seenValue = true;
            this.complete();
        };
        TakeUntilSubscriber.prototype.notifyComplete = function () {
        };
        return TakeUntilSubscriber;
    }(SimpleOuterSubscriber));

    function takeWhile(predicate, inclusive) {
        if (inclusive === void 0) { inclusive = false; }
        return function (source) {
            return source.lift(new TakeWhileOperator(predicate, inclusive));
        };
    }
    var TakeWhileOperator = (function () {
        function TakeWhileOperator(predicate, inclusive) {
            this.predicate = predicate;
            this.inclusive = inclusive;
        }
        TakeWhileOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate, this.inclusive));
        };
        return TakeWhileOperator;
    }());
    var TakeWhileSubscriber = (function (_super) {
        __extends(TakeWhileSubscriber, _super);
        function TakeWhileSubscriber(destination, predicate, inclusive) {
            var _this = _super.call(this, destination) || this;
            _this.predicate = predicate;
            _this.inclusive = inclusive;
            _this.index = 0;
            return _this;
        }
        TakeWhileSubscriber.prototype._next = function (value) {
            var destination = this.destination;
            var result;
            try {
                result = this.predicate(value, this.index++);
            }
            catch (err) {
                destination.error(err);
                return;
            }
            this.nextOrComplete(value, result);
        };
        TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
            var destination = this.destination;
            if (Boolean(predicateResult)) {
                destination.next(value);
            }
            else {
                if (this.inclusive) {
                    destination.next(value);
                }
                destination.complete();
            }
        };
        return TakeWhileSubscriber;
    }(Subscriber));

    function tap(nextOrObserver, error, complete) {
        return function tapOperatorFunction(source) {
            return source.lift(new DoOperator(nextOrObserver, error, complete));
        };
    }
    var DoOperator = (function () {
        function DoOperator(nextOrObserver, error, complete) {
            this.nextOrObserver = nextOrObserver;
            this.error = error;
            this.complete = complete;
        }
        DoOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
        };
        return DoOperator;
    }());
    var TapSubscriber = (function (_super) {
        __extends(TapSubscriber, _super);
        function TapSubscriber(destination, observerOrNext, error, complete) {
            var _this = _super.call(this, destination) || this;
            _this._tapNext = noop;
            _this._tapError = noop;
            _this._tapComplete = noop;
            _this._tapError = error || noop;
            _this._tapComplete = complete || noop;
            if (isFunction(observerOrNext)) {
                _this._context = _this;
                _this._tapNext = observerOrNext;
            }
            else if (observerOrNext) {
                _this._context = observerOrNext;
                _this._tapNext = observerOrNext.next || noop;
                _this._tapError = observerOrNext.error || noop;
                _this._tapComplete = observerOrNext.complete || noop;
            }
            return _this;
        }
        TapSubscriber.prototype._next = function (value) {
            try {
                this._tapNext.call(this._context, value);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(value);
        };
        TapSubscriber.prototype._error = function (err) {
            try {
                this._tapError.call(this._context, err);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.error(err);
        };
        TapSubscriber.prototype._complete = function () {
            try {
                this._tapComplete.call(this._context);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            return this.destination.complete();
        };
        return TapSubscriber;
    }(Subscriber));

    var defaultThrottleConfig = {
        leading: true,
        trailing: false
    };
    function throttle(durationSelector, config) {
        if (config === void 0) { config = defaultThrottleConfig; }
        return function (source) { return source.lift(new ThrottleOperator(durationSelector, !!config.leading, !!config.trailing)); };
    }
    var ThrottleOperator = (function () {
        function ThrottleOperator(durationSelector, leading, trailing) {
            this.durationSelector = durationSelector;
            this.leading = leading;
            this.trailing = trailing;
        }
        ThrottleOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
        };
        return ThrottleOperator;
    }());
    var ThrottleSubscriber = (function (_super) {
        __extends(ThrottleSubscriber, _super);
        function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            _this.durationSelector = durationSelector;
            _this._leading = _leading;
            _this._trailing = _trailing;
            _this._hasValue = false;
            return _this;
        }
        ThrottleSubscriber.prototype._next = function (value) {
            this._hasValue = true;
            this._sendValue = value;
            if (!this._throttled) {
                if (this._leading) {
                    this.send();
                }
                else {
                    this.throttle(value);
                }
            }
        };
        ThrottleSubscriber.prototype.send = function () {
            var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
            if (_hasValue) {
                this.destination.next(_sendValue);
                this.throttle(_sendValue);
            }
            this._hasValue = false;
            this._sendValue = undefined;
        };
        ThrottleSubscriber.prototype.throttle = function (value) {
            var duration = this.tryDurationSelector(value);
            if (!!duration) {
                this.add(this._throttled = innerSubscribe(duration, new SimpleInnerSubscriber(this)));
            }
        };
        ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
            try {
                return this.durationSelector(value);
            }
            catch (err) {
                this.destination.error(err);
                return null;
            }
        };
        ThrottleSubscriber.prototype.throttlingDone = function () {
            var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
            if (_throttled) {
                _throttled.unsubscribe();
            }
            this._throttled = undefined;
            if (_trailing) {
                this.send();
            }
        };
        ThrottleSubscriber.prototype.notifyNext = function () {
            this.throttlingDone();
        };
        ThrottleSubscriber.prototype.notifyComplete = function () {
            this.throttlingDone();
        };
        return ThrottleSubscriber;
    }(SimpleOuterSubscriber));

    function throttleTime(duration, scheduler, config) {
        if (scheduler === void 0) { scheduler = async; }
        if (config === void 0) { config = defaultThrottleConfig; }
        return function (source) { return source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing)); };
    }
    var ThrottleTimeOperator = (function () {
        function ThrottleTimeOperator(duration, scheduler, leading, trailing) {
            this.duration = duration;
            this.scheduler = scheduler;
            this.leading = leading;
            this.trailing = trailing;
        }
        ThrottleTimeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
        };
        return ThrottleTimeOperator;
    }());
    var ThrottleTimeSubscriber = (function (_super) {
        __extends(ThrottleTimeSubscriber, _super);
        function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
            var _this = _super.call(this, destination) || this;
            _this.duration = duration;
            _this.scheduler = scheduler;
            _this.leading = leading;
            _this.trailing = trailing;
            _this._hasTrailingValue = false;
            _this._trailingValue = null;
            return _this;
        }
        ThrottleTimeSubscriber.prototype._next = function (value) {
            if (this.throttled) {
                if (this.trailing) {
                    this._trailingValue = value;
                    this._hasTrailingValue = true;
                }
            }
            else {
                this.add(this.throttled = this.scheduler.schedule(dispatchNext$3, this.duration, { subscriber: this }));
                if (this.leading) {
                    this.destination.next(value);
                }
                else if (this.trailing) {
                    this._trailingValue = value;
                    this._hasTrailingValue = true;
                }
            }
        };
        ThrottleTimeSubscriber.prototype._complete = function () {
            if (this._hasTrailingValue) {
                this.destination.next(this._trailingValue);
                this.destination.complete();
            }
            else {
                this.destination.complete();
            }
        };
        ThrottleTimeSubscriber.prototype.clearThrottle = function () {
            var throttled = this.throttled;
            if (throttled) {
                if (this.trailing && this._hasTrailingValue) {
                    this.destination.next(this._trailingValue);
                    this._trailingValue = null;
                    this._hasTrailingValue = false;
                }
                throttled.unsubscribe();
                this.remove(throttled);
                this.throttled = null;
            }
        };
        return ThrottleTimeSubscriber;
    }(Subscriber));
    function dispatchNext$3(arg) {
        var subscriber = arg.subscriber;
        subscriber.clearThrottle();
    }

    function timeInterval(scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        return function (source) { return defer(function () {
            return source.pipe(scan(function (_a, value) {
                var current = _a.current;
                return ({ value: value, current: scheduler.now(), last: current });
            }, { current: scheduler.now(), value: undefined, last: undefined }), map(function (_a) {
                var current = _a.current, last = _a.last, value = _a.value;
                return new TimeInterval(value, current - last);
            }));
        }); };
    }
    var TimeInterval = (function () {
        function TimeInterval(value, interval) {
            this.value = value;
            this.interval = interval;
        }
        return TimeInterval;
    }());

    function timeoutWith(due, withObservable, scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        return function (source) {
            var absoluteTimeout = isDate(due);
            var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
            return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
        };
    }
    var TimeoutWithOperator = (function () {
        function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
            this.waitFor = waitFor;
            this.absoluteTimeout = absoluteTimeout;
            this.withObservable = withObservable;
            this.scheduler = scheduler;
        }
        TimeoutWithOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
        };
        return TimeoutWithOperator;
    }());
    var TimeoutWithSubscriber = (function (_super) {
        __extends(TimeoutWithSubscriber, _super);
        function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
            var _this = _super.call(this, destination) || this;
            _this.absoluteTimeout = absoluteTimeout;
            _this.waitFor = waitFor;
            _this.withObservable = withObservable;
            _this.scheduler = scheduler;
            _this.scheduleTimeout();
            return _this;
        }
        TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
            var withObservable = subscriber.withObservable;
            subscriber._unsubscribeAndRecycle();
            subscriber.add(innerSubscribe(withObservable, new SimpleInnerSubscriber(subscriber)));
        };
        TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
            var action = this.action;
            if (action) {
                this.action = action.schedule(this, this.waitFor);
            }
            else {
                this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
            }
        };
        TimeoutWithSubscriber.prototype._next = function (value) {
            if (!this.absoluteTimeout) {
                this.scheduleTimeout();
            }
            _super.prototype._next.call(this, value);
        };
        TimeoutWithSubscriber.prototype._unsubscribe = function () {
            this.action = undefined;
            this.scheduler = null;
            this.withObservable = null;
        };
        return TimeoutWithSubscriber;
    }(SimpleOuterSubscriber));

    function timeout(due, scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        return timeoutWith(due, throwError(new TimeoutError()), scheduler);
    }

    function timestamp(scheduler) {
        if (scheduler === void 0) { scheduler = async; }
        return map(function (value) { return new Timestamp(value, scheduler.now()); });
    }
    var Timestamp = (function () {
        function Timestamp(value, timestamp) {
            this.value = value;
            this.timestamp = timestamp;
        }
        return Timestamp;
    }());

    function toArrayReducer(arr, item, index) {
        if (index === 0) {
            return [item];
        }
        arr.push(item);
        return arr;
    }
    function toArray() {
        return reduce(toArrayReducer, []);
    }

    function window$1(windowBoundaries) {
        return function windowOperatorFunction(source) {
            return source.lift(new WindowOperator(windowBoundaries));
        };
    }
    var WindowOperator = (function () {
        function WindowOperator(windowBoundaries) {
            this.windowBoundaries = windowBoundaries;
        }
        WindowOperator.prototype.call = function (subscriber, source) {
            var windowSubscriber = new WindowSubscriber(subscriber);
            var sourceSubscription = source.subscribe(windowSubscriber);
            if (!sourceSubscription.closed) {
                windowSubscriber.add(innerSubscribe(this.windowBoundaries, new SimpleInnerSubscriber(windowSubscriber)));
            }
            return sourceSubscription;
        };
        return WindowOperator;
    }());
    var WindowSubscriber = (function (_super) {
        __extends(WindowSubscriber, _super);
        function WindowSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.window = new Subject();
            destination.next(_this.window);
            return _this;
        }
        WindowSubscriber.prototype.notifyNext = function () {
            this.openWindow();
        };
        WindowSubscriber.prototype.notifyError = function (error) {
            this._error(error);
        };
        WindowSubscriber.prototype.notifyComplete = function () {
            this._complete();
        };
        WindowSubscriber.prototype._next = function (value) {
            this.window.next(value);
        };
        WindowSubscriber.prototype._error = function (err) {
            this.window.error(err);
            this.destination.error(err);
        };
        WindowSubscriber.prototype._complete = function () {
            this.window.complete();
            this.destination.complete();
        };
        WindowSubscriber.prototype._unsubscribe = function () {
            this.window = null;
        };
        WindowSubscriber.prototype.openWindow = function () {
            var prevWindow = this.window;
            if (prevWindow) {
                prevWindow.complete();
            }
            var destination = this.destination;
            var newWindow = this.window = new Subject();
            destination.next(newWindow);
        };
        return WindowSubscriber;
    }(SimpleOuterSubscriber));

    function windowCount(windowSize, startWindowEvery) {
        if (startWindowEvery === void 0) { startWindowEvery = 0; }
        return function windowCountOperatorFunction(source) {
            return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
        };
    }
    var WindowCountOperator = (function () {
        function WindowCountOperator(windowSize, startWindowEvery) {
            this.windowSize = windowSize;
            this.startWindowEvery = startWindowEvery;
        }
        WindowCountOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
        };
        return WindowCountOperator;
    }());
    var WindowCountSubscriber = (function (_super) {
        __extends(WindowCountSubscriber, _super);
        function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            _this.windowSize = windowSize;
            _this.startWindowEvery = startWindowEvery;
            _this.windows = [new Subject()];
            _this.count = 0;
            destination.next(_this.windows[0]);
            return _this;
        }
        WindowCountSubscriber.prototype._next = function (value) {
            var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
            var destination = this.destination;
            var windowSize = this.windowSize;
            var windows = this.windows;
            var len = windows.length;
            for (var i = 0; i < len && !this.closed; i++) {
                windows[i].next(value);
            }
            var c = this.count - windowSize + 1;
            if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
                windows.shift().complete();
            }
            if (++this.count % startWindowEvery === 0 && !this.closed) {
                var window_1 = new Subject();
                windows.push(window_1);
                destination.next(window_1);
            }
        };
        WindowCountSubscriber.prototype._error = function (err) {
            var windows = this.windows;
            if (windows) {
                while (windows.length > 0 && !this.closed) {
                    windows.shift().error(err);
                }
            }
            this.destination.error(err);
        };
        WindowCountSubscriber.prototype._complete = function () {
            var windows = this.windows;
            if (windows) {
                while (windows.length > 0 && !this.closed) {
                    windows.shift().complete();
                }
            }
            this.destination.complete();
        };
        WindowCountSubscriber.prototype._unsubscribe = function () {
            this.count = 0;
            this.windows = null;
        };
        return WindowCountSubscriber;
    }(Subscriber));

    function windowTime(windowTimeSpan) {
        var scheduler = async;
        var windowCreationInterval = null;
        var maxWindowSize = Number.POSITIVE_INFINITY;
        if (isScheduler(arguments[3])) {
            scheduler = arguments[3];
        }
        if (isScheduler(arguments[2])) {
            scheduler = arguments[2];
        }
        else if (isNumeric(arguments[2])) {
            maxWindowSize = Number(arguments[2]);
        }
        if (isScheduler(arguments[1])) {
            scheduler = arguments[1];
        }
        else if (isNumeric(arguments[1])) {
            windowCreationInterval = Number(arguments[1]);
        }
        return function windowTimeOperatorFunction(source) {
            return source.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler));
        };
    }
    var WindowTimeOperator = (function () {
        function WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
            this.windowTimeSpan = windowTimeSpan;
            this.windowCreationInterval = windowCreationInterval;
            this.maxWindowSize = maxWindowSize;
            this.scheduler = scheduler;
        }
        WindowTimeOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
        };
        return WindowTimeOperator;
    }());
    var CountedSubject = (function (_super) {
        __extends(CountedSubject, _super);
        function CountedSubject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._numberOfNextedValues = 0;
            return _this;
        }
        CountedSubject.prototype.next = function (value) {
            this._numberOfNextedValues++;
            _super.prototype.next.call(this, value);
        };
        Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
            get: function () {
                return this._numberOfNextedValues;
            },
            enumerable: true,
            configurable: true
        });
        return CountedSubject;
    }(Subject));
    var WindowTimeSubscriber = (function (_super) {
        __extends(WindowTimeSubscriber, _super);
        function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            _this.windowTimeSpan = windowTimeSpan;
            _this.windowCreationInterval = windowCreationInterval;
            _this.maxWindowSize = maxWindowSize;
            _this.scheduler = scheduler;
            _this.windows = [];
            var window = _this.openWindow();
            if (windowCreationInterval !== null && windowCreationInterval >= 0) {
                var closeState = { subscriber: _this, window: window, context: null };
                var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
                _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
                _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
            }
            else {
                var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
                _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
            }
            return _this;
        }
        WindowTimeSubscriber.prototype._next = function (value) {
            var windows = this.windows;
            var len = windows.length;
            for (var i = 0; i < len; i++) {
                var window_1 = windows[i];
                if (!window_1.closed) {
                    window_1.next(value);
                    if (window_1.numberOfNextedValues >= this.maxWindowSize) {
                        this.closeWindow(window_1);
                    }
                }
            }
        };
        WindowTimeSubscriber.prototype._error = function (err) {
            var windows = this.windows;
            while (windows.length > 0) {
                windows.shift().error(err);
            }
            this.destination.error(err);
        };
        WindowTimeSubscriber.prototype._complete = function () {
            var windows = this.windows;
            while (windows.length > 0) {
                var window_2 = windows.shift();
                if (!window_2.closed) {
                    window_2.complete();
                }
            }
            this.destination.complete();
        };
        WindowTimeSubscriber.prototype.openWindow = function () {
            var window = new CountedSubject();
            this.windows.push(window);
            var destination = this.destination;
            destination.next(window);
            return window;
        };
        WindowTimeSubscriber.prototype.closeWindow = function (window) {
            window.complete();
            var windows = this.windows;
            windows.splice(windows.indexOf(window), 1);
        };
        return WindowTimeSubscriber;
    }(Subscriber));
    function dispatchWindowTimeSpanOnly(state) {
        var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
        if (window) {
            subscriber.closeWindow(window);
        }
        state.window = subscriber.openWindow();
        this.schedule(state, windowTimeSpan);
    }
    function dispatchWindowCreation(state) {
        var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
        var window = subscriber.openWindow();
        var action = this;
        var context = { action: action, subscription: null };
        var timeSpanState = { subscriber: subscriber, window: window, context: context };
        context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
        action.add(context.subscription);
        action.schedule(state, windowCreationInterval);
    }
    function dispatchWindowClose(state) {
        var subscriber = state.subscriber, window = state.window, context = state.context;
        if (context && context.action && context.subscription) {
            context.action.remove(context.subscription);
        }
        subscriber.closeWindow(window);
    }

    function windowToggle(openings, closingSelector) {
        return function (source) { return source.lift(new WindowToggleOperator(openings, closingSelector)); };
    }
    var WindowToggleOperator = (function () {
        function WindowToggleOperator(openings, closingSelector) {
            this.openings = openings;
            this.closingSelector = closingSelector;
        }
        WindowToggleOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
        };
        return WindowToggleOperator;
    }());
    var WindowToggleSubscriber = (function (_super) {
        __extends(WindowToggleSubscriber, _super);
        function WindowToggleSubscriber(destination, openings, closingSelector) {
            var _this = _super.call(this, destination) || this;
            _this.openings = openings;
            _this.closingSelector = closingSelector;
            _this.contexts = [];
            _this.add(_this.openSubscription = subscribeToResult(_this, openings, openings));
            return _this;
        }
        WindowToggleSubscriber.prototype._next = function (value) {
            var contexts = this.contexts;
            if (contexts) {
                var len = contexts.length;
                for (var i = 0; i < len; i++) {
                    contexts[i].window.next(value);
                }
            }
        };
        WindowToggleSubscriber.prototype._error = function (err) {
            var contexts = this.contexts;
            this.contexts = null;
            if (contexts) {
                var len = contexts.length;
                var index = -1;
                while (++index < len) {
                    var context_1 = contexts[index];
                    context_1.window.error(err);
                    context_1.subscription.unsubscribe();
                }
            }
            _super.prototype._error.call(this, err);
        };
        WindowToggleSubscriber.prototype._complete = function () {
            var contexts = this.contexts;
            this.contexts = null;
            if (contexts) {
                var len = contexts.length;
                var index = -1;
                while (++index < len) {
                    var context_2 = contexts[index];
                    context_2.window.complete();
                    context_2.subscription.unsubscribe();
                }
            }
            _super.prototype._complete.call(this);
        };
        WindowToggleSubscriber.prototype._unsubscribe = function () {
            var contexts = this.contexts;
            this.contexts = null;
            if (contexts) {
                var len = contexts.length;
                var index = -1;
                while (++index < len) {
                    var context_3 = contexts[index];
                    context_3.window.unsubscribe();
                    context_3.subscription.unsubscribe();
                }
            }
        };
        WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (outerValue === this.openings) {
                var closingNotifier = void 0;
                try {
                    var closingSelector = this.closingSelector;
                    closingNotifier = closingSelector(innerValue);
                }
                catch (e) {
                    return this.error(e);
                }
                var window_1 = new Subject();
                var subscription = new Subscription();
                var context_4 = { window: window_1, subscription: subscription };
                this.contexts.push(context_4);
                var innerSubscription = subscribeToResult(this, closingNotifier, context_4);
                if (innerSubscription.closed) {
                    this.closeWindow(this.contexts.length - 1);
                }
                else {
                    innerSubscription.context = context_4;
                    subscription.add(innerSubscription);
                }
                this.destination.next(window_1);
            }
            else {
                this.closeWindow(this.contexts.indexOf(outerValue));
            }
        };
        WindowToggleSubscriber.prototype.notifyError = function (err) {
            this.error(err);
        };
        WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
            if (inner !== this.openSubscription) {
                this.closeWindow(this.contexts.indexOf(inner.context));
            }
        };
        WindowToggleSubscriber.prototype.closeWindow = function (index) {
            if (index === -1) {
                return;
            }
            var contexts = this.contexts;
            var context = contexts[index];
            var window = context.window, subscription = context.subscription;
            contexts.splice(index, 1);
            window.complete();
            subscription.unsubscribe();
        };
        return WindowToggleSubscriber;
    }(OuterSubscriber));

    function windowWhen(closingSelector) {
        return function windowWhenOperatorFunction(source) {
            return source.lift(new WindowOperator$1(closingSelector));
        };
    }
    var WindowOperator$1 = (function () {
        function WindowOperator(closingSelector) {
            this.closingSelector = closingSelector;
        }
        WindowOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new WindowSubscriber$1(subscriber, this.closingSelector));
        };
        return WindowOperator;
    }());
    var WindowSubscriber$1 = (function (_super) {
        __extends(WindowSubscriber, _super);
        function WindowSubscriber(destination, closingSelector) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            _this.closingSelector = closingSelector;
            _this.openWindow();
            return _this;
        }
        WindowSubscriber.prototype.notifyNext = function (_outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
            this.openWindow(innerSub);
        };
        WindowSubscriber.prototype.notifyError = function (error) {
            this._error(error);
        };
        WindowSubscriber.prototype.notifyComplete = function (innerSub) {
            this.openWindow(innerSub);
        };
        WindowSubscriber.prototype._next = function (value) {
            this.window.next(value);
        };
        WindowSubscriber.prototype._error = function (err) {
            this.window.error(err);
            this.destination.error(err);
            this.unsubscribeClosingNotification();
        };
        WindowSubscriber.prototype._complete = function () {
            this.window.complete();
            this.destination.complete();
            this.unsubscribeClosingNotification();
        };
        WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
            if (this.closingNotification) {
                this.closingNotification.unsubscribe();
            }
        };
        WindowSubscriber.prototype.openWindow = function (innerSub) {
            if (innerSub === void 0) { innerSub = null; }
            if (innerSub) {
                this.remove(innerSub);
                innerSub.unsubscribe();
            }
            var prevWindow = this.window;
            if (prevWindow) {
                prevWindow.complete();
            }
            var window = this.window = new Subject();
            this.destination.next(window);
            var closingNotifier;
            try {
                var closingSelector = this.closingSelector;
                closingNotifier = closingSelector();
            }
            catch (e) {
                this.destination.error(e);
                this.window.error(e);
                return;
            }
            this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
        };
        return WindowSubscriber;
    }(OuterSubscriber));

    function withLatestFrom() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (source) {
            var project;
            if (typeof args[args.length - 1] === 'function') {
                project = args.pop();
            }
            var observables = args;
            return source.lift(new WithLatestFromOperator(observables, project));
        };
    }
    var WithLatestFromOperator = (function () {
        function WithLatestFromOperator(observables, project) {
            this.observables = observables;
            this.project = project;
        }
        WithLatestFromOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
        };
        return WithLatestFromOperator;
    }());
    var WithLatestFromSubscriber = (function (_super) {
        __extends(WithLatestFromSubscriber, _super);
        function WithLatestFromSubscriber(destination, observables, project) {
            var _this = _super.call(this, destination) || this;
            _this.observables = observables;
            _this.project = project;
            _this.toRespond = [];
            var len = observables.length;
            _this.values = new Array(len);
            for (var i = 0; i < len; i++) {
                _this.toRespond.push(i);
            }
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                _this.add(subscribeToResult(_this, observable, undefined, i));
            }
            return _this;
        }
        WithLatestFromSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
            this.values[outerIndex] = innerValue;
            var toRespond = this.toRespond;
            if (toRespond.length > 0) {
                var found = toRespond.indexOf(outerIndex);
                if (found !== -1) {
                    toRespond.splice(found, 1);
                }
            }
        };
        WithLatestFromSubscriber.prototype.notifyComplete = function () {
        };
        WithLatestFromSubscriber.prototype._next = function (value) {
            if (this.toRespond.length === 0) {
                var args = [value].concat(this.values);
                if (this.project) {
                    this._tryProject(args);
                }
                else {
                    this.destination.next(args);
                }
            }
        };
        WithLatestFromSubscriber.prototype._tryProject = function (args) {
            var result;
            try {
                result = this.project.apply(this, args);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return WithLatestFromSubscriber;
    }(OuterSubscriber));

    function zip$1() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        return function zipOperatorFunction(source) {
            return source.lift.call(zip.apply(void 0, [source].concat(observables)));
        };
    }

    function zipAll(project) {
        return function (source) { return source.lift(new ZipOperator(project)); };
    }



    var _operators = /*#__PURE__*/Object.freeze({
        audit: audit,
        auditTime: auditTime,
        buffer: buffer,
        bufferCount: bufferCount,
        bufferTime: bufferTime,
        bufferToggle: bufferToggle,
        bufferWhen: bufferWhen,
        catchError: catchError,
        combineAll: combineAll,
        combineLatest: combineLatest$1,
        concat: concat$1,
        concatAll: concatAll,
        concatMap: concatMap,
        concatMapTo: concatMapTo,
        count: count,
        debounce: debounce,
        debounceTime: debounceTime,
        defaultIfEmpty: defaultIfEmpty,
        delay: delay,
        delayWhen: delayWhen,
        dematerialize: dematerialize,
        distinct: distinct,
        distinctUntilChanged: distinctUntilChanged,
        distinctUntilKeyChanged: distinctUntilKeyChanged,
        elementAt: elementAt,
        endWith: endWith,
        every: every,
        exhaust: exhaust,
        exhaustMap: exhaustMap,
        expand: expand,
        filter: filter,
        finalize: finalize,
        find: find,
        findIndex: findIndex,
        first: first,
        groupBy: groupBy,
        ignoreElements: ignoreElements,
        isEmpty: isEmpty,
        last: last,
        map: map,
        mapTo: mapTo,
        materialize: materialize,
        max: max,
        merge: merge$1,
        mergeAll: mergeAll,
        mergeMap: mergeMap,
        flatMap: flatMap,
        mergeMapTo: mergeMapTo,
        mergeScan: mergeScan,
        min: min,
        multicast: multicast,
        observeOn: observeOn,
        onErrorResumeNext: onErrorResumeNext$1,
        pairwise: pairwise,
        partition: partition$1,
        pluck: pluck,
        publish: publish,
        publishBehavior: publishBehavior,
        publishLast: publishLast,
        publishReplay: publishReplay,
        race: race$1,
        reduce: reduce,
        repeat: repeat,
        repeatWhen: repeatWhen,
        retry: retry,
        retryWhen: retryWhen,
        refCount: refCount,
        sample: sample,
        sampleTime: sampleTime,
        scan: scan,
        sequenceEqual: sequenceEqual,
        share: share,
        shareReplay: shareReplay,
        single: single,
        skip: skip,
        skipLast: skipLast,
        skipUntil: skipUntil,
        skipWhile: skipWhile,
        startWith: startWith,
        subscribeOn: subscribeOn,
        switchAll: switchAll,
        switchMap: switchMap,
        switchMapTo: switchMapTo,
        take: take,
        takeLast: takeLast,
        takeUntil: takeUntil,
        takeWhile: takeWhile,
        tap: tap,
        throttle: throttle,
        throttleTime: throttleTime,
        throwIfEmpty: throwIfEmpty,
        timeInterval: timeInterval,
        timeout: timeout,
        timeoutWith: timeoutWith,
        timestamp: timestamp,
        toArray: toArray,
        window: window$1,
        windowCount: windowCount,
        windowTime: windowTime,
        windowToggle: windowToggle,
        windowWhen: windowWhen,
        withLatestFrom: withLatestFrom,
        zip: zip$1,
        zipAll: zipAll
    });

    var SubscriptionLog = (function () {
        function SubscriptionLog(subscribedFrame, unsubscribedFrame) {
            if (unsubscribedFrame === void 0) { unsubscribedFrame = Number.POSITIVE_INFINITY; }
            this.subscribedFrame = subscribedFrame;
            this.unsubscribedFrame = unsubscribedFrame;
        }
        return SubscriptionLog;
    }());

    var SubscriptionLoggable = (function () {
        function SubscriptionLoggable() {
            this.subscriptions = [];
        }
        SubscriptionLoggable.prototype.logSubscribedFrame = function () {
            this.subscriptions.push(new SubscriptionLog(this.scheduler.now()));
            return this.subscriptions.length - 1;
        };
        SubscriptionLoggable.prototype.logUnsubscribedFrame = function (index) {
            var subscriptionLogs = this.subscriptions;
            var oldSubscriptionLog = subscriptionLogs[index];
            subscriptionLogs[index] = new SubscriptionLog(oldSubscriptionLog.subscribedFrame, this.scheduler.now());
        };
        return SubscriptionLoggable;
    }());

    function applyMixins(derivedCtor, baseCtors) {
        for (var i = 0, len = baseCtors.length; i < len; i++) {
            var baseCtor = baseCtors[i];
            var propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
            for (var j = 0, len2 = propertyKeys.length; j < len2; j++) {
                var name_1 = propertyKeys[j];
                derivedCtor.prototype[name_1] = baseCtor.prototype[name_1];
            }
        }
    }

    var ColdObservable = (function (_super) {
        __extends(ColdObservable, _super);
        function ColdObservable(messages, scheduler) {
            var _this = _super.call(this, function (subscriber) {
                var observable = this;
                var index = observable.logSubscribedFrame();
                var subscription = new Subscription();
                subscription.add(new Subscription(function () {
                    observable.logUnsubscribedFrame(index);
                }));
                observable.scheduleMessages(subscriber);
                return subscription;
            }) || this;
            _this.messages = messages;
            _this.subscriptions = [];
            _this.scheduler = scheduler;
            return _this;
        }
        ColdObservable.prototype.scheduleMessages = function (subscriber) {
            var messagesLength = this.messages.length;
            for (var i = 0; i < messagesLength; i++) {
                var message = this.messages[i];
                subscriber.add(this.scheduler.schedule(function (_a) {
                    var message = _a.message, subscriber = _a.subscriber;
                    message.notification.observe(subscriber);
                }, message.frame, { message: message, subscriber: subscriber }));
            }
        };
        return ColdObservable;
    }(Observable));
    applyMixins(ColdObservable, [SubscriptionLoggable]);

    var HotObservable = (function (_super) {
        __extends(HotObservable, _super);
        function HotObservable(messages, scheduler) {
            var _this = _super.call(this) || this;
            _this.messages = messages;
            _this.subscriptions = [];
            _this.scheduler = scheduler;
            return _this;
        }
        HotObservable.prototype._subscribe = function (subscriber) {
            var subject = this;
            var index = subject.logSubscribedFrame();
            var subscription = new Subscription();
            subscription.add(new Subscription(function () {
                subject.logUnsubscribedFrame(index);
            }));
            subscription.add(_super.prototype._subscribe.call(this, subscriber));
            return subscription;
        };
        HotObservable.prototype.setup = function () {
            var subject = this;
            var messagesLength = subject.messages.length;
            for (var i = 0; i < messagesLength; i++) {
                (function () {
                    var message = subject.messages[i];
                    subject.scheduler.schedule(function () { message.notification.observe(subject); }, message.frame);
                })();
            }
        };
        return HotObservable;
    }(Subject));
    applyMixins(HotObservable, [SubscriptionLoggable]);

    var defaultMaxFrame = 750;
    var TestScheduler = (function (_super) {
        __extends(TestScheduler, _super);
        function TestScheduler(assertDeepEqual) {
            var _this = _super.call(this, VirtualAction, defaultMaxFrame) || this;
            _this.assertDeepEqual = assertDeepEqual;
            _this.hotObservables = [];
            _this.coldObservables = [];
            _this.flushTests = [];
            _this.runMode = false;
            return _this;
        }
        TestScheduler.prototype.createTime = function (marbles) {
            var indexOf = marbles.indexOf('|');
            if (indexOf === -1) {
                throw new Error('marble diagram for time should have a completion marker "|"');
            }
            return indexOf * TestScheduler.frameTimeFactor;
        };
        TestScheduler.prototype.createColdObservable = function (marbles, values, error) {
            if (marbles.indexOf('^') !== -1) {
                throw new Error('cold observable cannot have subscription offset "^"');
            }
            if (marbles.indexOf('!') !== -1) {
                throw new Error('cold observable cannot have unsubscription marker "!"');
            }
            var messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
            var cold = new ColdObservable(messages, this);
            this.coldObservables.push(cold);
            return cold;
        };
        TestScheduler.prototype.createHotObservable = function (marbles, values, error) {
            if (marbles.indexOf('!') !== -1) {
                throw new Error('hot observable cannot have unsubscription marker "!"');
            }
            var messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
            var subject = new HotObservable(messages, this);
            this.hotObservables.push(subject);
            return subject;
        };
        TestScheduler.prototype.materializeInnerObservable = function (observable, outerFrame) {
            var _this = this;
            var messages = [];
            observable.subscribe(function (value) {
                messages.push({ frame: _this.frame - outerFrame, notification: Notification.createNext(value) });
            }, function (err) {
                messages.push({ frame: _this.frame - outerFrame, notification: Notification.createError(err) });
            }, function () {
                messages.push({ frame: _this.frame - outerFrame, notification: Notification.createComplete() });
            });
            return messages;
        };
        TestScheduler.prototype.expectObservable = function (observable, subscriptionMarbles) {
            var _this = this;
            if (subscriptionMarbles === void 0) { subscriptionMarbles = null; }
            var actual = [];
            var flushTest = { actual: actual, ready: false };
            var subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
            var subscriptionFrame = subscriptionParsed.subscribedFrame === Number.POSITIVE_INFINITY ?
                0 : subscriptionParsed.subscribedFrame;
            var unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
            var subscription;
            this.schedule(function () {
                subscription = observable.subscribe(function (x) {
                    var value = x;
                    if (x instanceof Observable) {
                        value = _this.materializeInnerObservable(value, _this.frame);
                    }
                    actual.push({ frame: _this.frame, notification: Notification.createNext(value) });
                }, function (err) {
                    actual.push({ frame: _this.frame, notification: Notification.createError(err) });
                }, function () {
                    actual.push({ frame: _this.frame, notification: Notification.createComplete() });
                });
            }, subscriptionFrame);
            if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                this.schedule(function () { return subscription.unsubscribe(); }, unsubscriptionFrame);
            }
            this.flushTests.push(flushTest);
            var runMode = this.runMode;
            return {
                toBe: function (marbles, values, errorValue) {
                    flushTest.ready = true;
                    flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
                }
            };
        };
        TestScheduler.prototype.expectSubscriptions = function (actualSubscriptionLogs) {
            var flushTest = { actual: actualSubscriptionLogs, ready: false };
            this.flushTests.push(flushTest);
            var runMode = this.runMode;
            return {
                toBe: function (marbles) {
                    var marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                    flushTest.ready = true;
                    flushTest.expected = marblesArray.map(function (marbles) {
                        return TestScheduler.parseMarblesAsSubscriptions(marbles, runMode);
                    });
                }
            };
        };
        TestScheduler.prototype.flush = function () {
            var _this = this;
            var hotObservables = this.hotObservables;
            while (hotObservables.length > 0) {
                hotObservables.shift().setup();
            }
            _super.prototype.flush.call(this);
            this.flushTests = this.flushTests.filter(function (test) {
                if (test.ready) {
                    _this.assertDeepEqual(test.actual, test.expected);
                    return false;
                }
                return true;
            });
        };
        TestScheduler.parseMarblesAsSubscriptions = function (marbles, runMode) {
            var _this = this;
            if (runMode === void 0) { runMode = false; }
            if (typeof marbles !== 'string') {
                return new SubscriptionLog(Number.POSITIVE_INFINITY);
            }
            var len = marbles.length;
            var groupStart = -1;
            var subscriptionFrame = Number.POSITIVE_INFINITY;
            var unsubscriptionFrame = Number.POSITIVE_INFINITY;
            var frame = 0;
            var _loop_1 = function (i) {
                var nextFrame = frame;
                var advanceFrameBy = function (count) {
                    nextFrame += count * _this.frameTimeFactor;
                };
                var c = marbles[i];
                switch (c) {
                    case ' ':
                        if (!runMode) {
                            advanceFrameBy(1);
                        }
                        break;
                    case '-':
                        advanceFrameBy(1);
                        break;
                    case '(':
                        groupStart = frame;
                        advanceFrameBy(1);
                        break;
                    case ')':
                        groupStart = -1;
                        advanceFrameBy(1);
                        break;
                    case '^':
                        if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
                            throw new Error('found a second subscription point \'^\' in a ' +
                                'subscription marble diagram. There can only be one.');
                        }
                        subscriptionFrame = groupStart > -1 ? groupStart : frame;
                        advanceFrameBy(1);
                        break;
                    case '!':
                        if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                            throw new Error('found a second subscription point \'^\' in a ' +
                                'subscription marble diagram. There can only be one.');
                        }
                        unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                        break;
                    default:
                        if (runMode && c.match(/^[0-9]$/)) {
                            if (i === 0 || marbles[i - 1] === ' ') {
                                var buffer = marbles.slice(i);
                                var match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                                if (match) {
                                    i += match[0].length - 1;
                                    var duration = parseFloat(match[1]);
                                    var unit = match[2];
                                    var durationInMs = void 0;
                                    switch (unit) {
                                        case 'ms':
                                            durationInMs = duration;
                                            break;
                                        case 's':
                                            durationInMs = duration * 1000;
                                            break;
                                        case 'm':
                                            durationInMs = duration * 1000 * 60;
                                            break;
                                        default:
                                            break;
                                    }
                                    advanceFrameBy(durationInMs / this_1.frameTimeFactor);
                                    break;
                                }
                            }
                        }
                        throw new Error('there can only be \'^\' and \'!\' markers in a ' +
                            'subscription marble diagram. Found instead \'' + c + '\'.');
                }
                frame = nextFrame;
                out_i_1 = i;
            };
            var this_1 = this, out_i_1;
            for (var i = 0; i < len; i++) {
                _loop_1(i);
                i = out_i_1;
            }
            if (unsubscriptionFrame < 0) {
                return new SubscriptionLog(subscriptionFrame);
            }
            else {
                return new SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
            }
        };
        TestScheduler.parseMarbles = function (marbles, values, errorValue, materializeInnerObservables, runMode) {
            var _this = this;
            if (materializeInnerObservables === void 0) { materializeInnerObservables = false; }
            if (runMode === void 0) { runMode = false; }
            if (marbles.indexOf('!') !== -1) {
                throw new Error('conventional marble diagrams cannot have the ' +
                    'unsubscription marker "!"');
            }
            var len = marbles.length;
            var testMessages = [];
            var subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
            var frame = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
            var getValue = typeof values !== 'object' ?
                function (x) { return x; } :
                function (x) {
                    if (materializeInnerObservables && values[x] instanceof ColdObservable) {
                        return values[x].messages;
                    }
                    return values[x];
                };
            var groupStart = -1;
            var _loop_2 = function (i) {
                var nextFrame = frame;
                var advanceFrameBy = function (count) {
                    nextFrame += count * _this.frameTimeFactor;
                };
                var notification = void 0;
                var c = marbles[i];
                switch (c) {
                    case ' ':
                        if (!runMode) {
                            advanceFrameBy(1);
                        }
                        break;
                    case '-':
                        advanceFrameBy(1);
                        break;
                    case '(':
                        groupStart = frame;
                        advanceFrameBy(1);
                        break;
                    case ')':
                        groupStart = -1;
                        advanceFrameBy(1);
                        break;
                    case '|':
                        notification = Notification.createComplete();
                        advanceFrameBy(1);
                        break;
                    case '^':
                        advanceFrameBy(1);
                        break;
                    case '#':
                        notification = Notification.createError(errorValue || 'error');
                        advanceFrameBy(1);
                        break;
                    default:
                        if (runMode && c.match(/^[0-9]$/)) {
                            if (i === 0 || marbles[i - 1] === ' ') {
                                var buffer = marbles.slice(i);
                                var match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                                if (match) {
                                    i += match[0].length - 1;
                                    var duration = parseFloat(match[1]);
                                    var unit = match[2];
                                    var durationInMs = void 0;
                                    switch (unit) {
                                        case 'ms':
                                            durationInMs = duration;
                                            break;
                                        case 's':
                                            durationInMs = duration * 1000;
                                            break;
                                        case 'm':
                                            durationInMs = duration * 1000 * 60;
                                            break;
                                        default:
                                            break;
                                    }
                                    advanceFrameBy(durationInMs / this_2.frameTimeFactor);
                                    break;
                                }
                            }
                        }
                        notification = Notification.createNext(getValue(c));
                        advanceFrameBy(1);
                        break;
                }
                if (notification) {
                    testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification: notification });
                }
                frame = nextFrame;
                out_i_2 = i;
            };
            var this_2 = this, out_i_2;
            for (var i = 0; i < len; i++) {
                _loop_2(i);
                i = out_i_2;
            }
            return testMessages;
        };
        TestScheduler.prototype.run = function (callback) {
            var prevFrameTimeFactor = TestScheduler.frameTimeFactor;
            var prevMaxFrames = this.maxFrames;
            TestScheduler.frameTimeFactor = 1;
            this.maxFrames = Number.POSITIVE_INFINITY;
            this.runMode = true;
            AsyncScheduler.delegate = this;
            var helpers = {
                cold: this.createColdObservable.bind(this),
                hot: this.createHotObservable.bind(this),
                flush: this.flush.bind(this),
                expectObservable: this.expectObservable.bind(this),
                expectSubscriptions: this.expectSubscriptions.bind(this),
            };
            try {
                var ret = callback(helpers);
                this.flush();
                return ret;
            }
            finally {
                TestScheduler.frameTimeFactor = prevFrameTimeFactor;
                this.maxFrames = prevMaxFrames;
                this.runMode = false;
                AsyncScheduler.delegate = undefined;
            }
        };
        return TestScheduler;
    }(VirtualTimeScheduler));



    var _testing = /*#__PURE__*/Object.freeze({
        TestScheduler: TestScheduler
    });

    var __window = typeof window !== 'undefined' && window;
    var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
        self instanceof WorkerGlobalScope && self;
    var __global = typeof global !== 'undefined' && global;
    var _root = __window || __global || __self;
    (function () {
        if (!_root) {
            throw new Error('RxJS could not find any global context (window, self, global)');
        }
    })();

    function getCORSRequest() {
        if (_root.XMLHttpRequest) {
            return new _root.XMLHttpRequest();
        }
        else if (!!_root.XDomainRequest) {
            return new _root.XDomainRequest();
        }
        else {
            throw new Error('CORS is not supported by your browser');
        }
    }
    function getXMLHttpRequest() {
        if (_root.XMLHttpRequest) {
            return new _root.XMLHttpRequest();
        }
        else {
            var progId = void 0;
            try {
                var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
                for (var i = 0; i < 3; i++) {
                    try {
                        progId = progIds[i];
                        if (new _root.ActiveXObject(progId)) {
                            break;
                        }
                    }
                    catch (e) {
                    }
                }
                return new _root.ActiveXObject(progId);
            }
            catch (e) {
                throw new Error('XMLHttpRequest is not supported by your browser');
            }
        }
    }
    function ajaxGet(url, headers) {
        if (headers === void 0) { headers = null; }
        return new AjaxObservable({ method: 'GET', url: url, headers: headers });
    }
    function ajaxPost(url, body, headers) {
        return new AjaxObservable({ method: 'POST', url: url, body: body, headers: headers });
    }
    function ajaxDelete(url, headers) {
        return new AjaxObservable({ method: 'DELETE', url: url, headers: headers });
    }
    function ajaxPut(url, body, headers) {
        return new AjaxObservable({ method: 'PUT', url: url, body: body, headers: headers });
    }
    function ajaxPatch(url, body, headers) {
        return new AjaxObservable({ method: 'PATCH', url: url, body: body, headers: headers });
    }
    var mapResponse = map(function (x, index) { return x.response; });
    function ajaxGetJSON(url, headers) {
        return mapResponse(new AjaxObservable({
            method: 'GET',
            url: url,
            responseType: 'json',
            headers: headers
        }));
    }
    var AjaxObservable = (function (_super) {
        __extends(AjaxObservable, _super);
        function AjaxObservable(urlOrRequest) {
            var _this = _super.call(this) || this;
            var request = {
                async: true,
                createXHR: function () {
                    return this.crossDomain ? getCORSRequest() : getXMLHttpRequest();
                },
                crossDomain: true,
                withCredentials: false,
                headers: {},
                method: 'GET',
                responseType: 'json',
                timeout: 0
            };
            if (typeof urlOrRequest === 'string') {
                request.url = urlOrRequest;
            }
            else {
                for (var prop in urlOrRequest) {
                    if (urlOrRequest.hasOwnProperty(prop)) {
                        request[prop] = urlOrRequest[prop];
                    }
                }
            }
            _this.request = request;
            return _this;
        }
        AjaxObservable.prototype._subscribe = function (subscriber) {
            return new AjaxSubscriber(subscriber, this.request);
        };
        AjaxObservable.create = (function () {
            var create = function (urlOrRequest) {
                return new AjaxObservable(urlOrRequest);
            };
            create.get = ajaxGet;
            create.post = ajaxPost;
            create.delete = ajaxDelete;
            create.put = ajaxPut;
            create.patch = ajaxPatch;
            create.getJSON = ajaxGetJSON;
            return create;
        })();
        return AjaxObservable;
    }(Observable));
    var AjaxSubscriber = (function (_super) {
        __extends(AjaxSubscriber, _super);
        function AjaxSubscriber(destination, request) {
            var _this = _super.call(this, destination) || this;
            _this.request = request;
            _this.done = false;
            var headers = request.headers = request.headers || {};
            if (!request.crossDomain && !_this.getHeader(headers, 'X-Requested-With')) {
                headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            var contentTypeHeader = _this.getHeader(headers, 'Content-Type');
            if (!contentTypeHeader && !(_root.FormData && request.body instanceof _root.FormData) && typeof request.body !== 'undefined') {
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }
            request.body = _this.serializeBody(request.body, _this.getHeader(request.headers, 'Content-Type'));
            _this.send();
            return _this;
        }
        AjaxSubscriber.prototype.next = function (e) {
            this.done = true;
            var _a = this, xhr = _a.xhr, request = _a.request, destination = _a.destination;
            var result;
            try {
                result = new AjaxResponse(e, xhr, request);
            }
            catch (err) {
                return destination.error(err);
            }
            destination.next(result);
        };
        AjaxSubscriber.prototype.send = function () {
            var _a = this, request = _a.request, _b = _a.request, user = _b.user, method = _b.method, url = _b.url, async = _b.async, password = _b.password, headers = _b.headers, body = _b.body;
            try {
                var xhr = this.xhr = request.createXHR();
                this.setupEvents(xhr, request);
                if (user) {
                    xhr.open(method, url, async, user, password);
                }
                else {
                    xhr.open(method, url, async);
                }
                if (async) {
                    xhr.timeout = request.timeout;
                    xhr.responseType = request.responseType;
                }
                if ('withCredentials' in xhr) {
                    xhr.withCredentials = !!request.withCredentials;
                }
                this.setHeaders(xhr, headers);
                if (body) {
                    xhr.send(body);
                }
                else {
                    xhr.send();
                }
            }
            catch (err) {
                this.error(err);
            }
        };
        AjaxSubscriber.prototype.serializeBody = function (body, contentType) {
            if (!body || typeof body === 'string') {
                return body;
            }
            else if (_root.FormData && body instanceof _root.FormData) {
                return body;
            }
            if (contentType) {
                var splitIndex = contentType.indexOf(';');
                if (splitIndex !== -1) {
                    contentType = contentType.substring(0, splitIndex);
                }
            }
            switch (contentType) {
                case 'application/x-www-form-urlencoded':
                    return Object.keys(body).map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(body[key]); }).join('&');
                case 'application/json':
                    return JSON.stringify(body);
                default:
                    return body;
            }
        };
        AjaxSubscriber.prototype.setHeaders = function (xhr, headers) {
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
        };
        AjaxSubscriber.prototype.getHeader = function (headers, headerName) {
            for (var key in headers) {
                if (key.toLowerCase() === headerName.toLowerCase()) {
                    return headers[key];
                }
            }
            return undefined;
        };
        AjaxSubscriber.prototype.setupEvents = function (xhr, request) {
            var progressSubscriber = request.progressSubscriber;
            function xhrTimeout(e) {
                var _a = xhrTimeout, subscriber = _a.subscriber, progressSubscriber = _a.progressSubscriber, request = _a.request;
                if (progressSubscriber) {
                    progressSubscriber.error(e);
                }
                var error;
                try {
                    error = new AjaxTimeoutError(this, request);
                }
                catch (err) {
                    error = err;
                }
                subscriber.error(error);
            }
            xhr.ontimeout = xhrTimeout;
            xhrTimeout.request = request;
            xhrTimeout.subscriber = this;
            xhrTimeout.progressSubscriber = progressSubscriber;
            if (xhr.upload && 'withCredentials' in xhr) {
                if (progressSubscriber) {
                    var xhrProgress_1;
                    xhrProgress_1 = function (e) {
                        var progressSubscriber = xhrProgress_1.progressSubscriber;
                        progressSubscriber.next(e);
                    };
                    if (_root.XDomainRequest) {
                        xhr.onprogress = xhrProgress_1;
                    }
                    else {
                        xhr.upload.onprogress = xhrProgress_1;
                    }
                    xhrProgress_1.progressSubscriber = progressSubscriber;
                }
                var xhrError_1;
                xhrError_1 = function (e) {
                    var _a = xhrError_1, progressSubscriber = _a.progressSubscriber, subscriber = _a.subscriber, request = _a.request;
                    if (progressSubscriber) {
                        progressSubscriber.error(e);
                    }
                    var error;
                    try {
                        error = new AjaxError('ajax error', this, request);
                    }
                    catch (err) {
                        error = err;
                    }
                    subscriber.error(error);
                };
                xhr.onerror = xhrError_1;
                xhrError_1.request = request;
                xhrError_1.subscriber = this;
                xhrError_1.progressSubscriber = progressSubscriber;
            }
            function xhrReadyStateChange(e) {
                return;
            }
            xhr.onreadystatechange = xhrReadyStateChange;
            xhrReadyStateChange.subscriber = this;
            xhrReadyStateChange.progressSubscriber = progressSubscriber;
            xhrReadyStateChange.request = request;
            function xhrLoad(e) {
                var _a = xhrLoad, subscriber = _a.subscriber, progressSubscriber = _a.progressSubscriber, request = _a.request;
                if (this.readyState === 4) {
                    var status_1 = this.status === 1223 ? 204 : this.status;
                    var response = (this.responseType === 'text' ? (this.response || this.responseText) : this.response);
                    if (status_1 === 0) {
                        status_1 = response ? 200 : 0;
                    }
                    if (status_1 < 400) {
                        if (progressSubscriber) {
                            progressSubscriber.complete();
                        }
                        subscriber.next(e);
                        subscriber.complete();
                    }
                    else {
                        if (progressSubscriber) {
                            progressSubscriber.error(e);
                        }
                        var error = void 0;
                        try {
                            error = new AjaxError('ajax error ' + status_1, this, request);
                        }
                        catch (err) {
                            error = err;
                        }
                        subscriber.error(error);
                    }
                }
            }
            xhr.onload = xhrLoad;
            xhrLoad.subscriber = this;
            xhrLoad.progressSubscriber = progressSubscriber;
            xhrLoad.request = request;
        };
        AjaxSubscriber.prototype.unsubscribe = function () {
            var _a = this, done = _a.done, xhr = _a.xhr;
            if (!done && xhr && xhr.readyState !== 4 && typeof xhr.abort === 'function') {
                xhr.abort();
            }
            _super.prototype.unsubscribe.call(this);
        };
        return AjaxSubscriber;
    }(Subscriber));
    var AjaxResponse = (function () {
        function AjaxResponse(originalEvent, xhr, request) {
            this.originalEvent = originalEvent;
            this.xhr = xhr;
            this.request = request;
            this.status = xhr.status;
            this.responseType = xhr.responseType || request.responseType;
            this.response = parseXhrResponse(this.responseType, xhr);
        }
        return AjaxResponse;
    }());
    var AjaxErrorImpl = (function () {
        function AjaxErrorImpl(message, xhr, request) {
            Error.call(this);
            this.message = message;
            this.name = 'AjaxError';
            this.xhr = xhr;
            this.request = request;
            this.status = xhr.status;
            this.responseType = xhr.responseType || request.responseType;
            this.response = parseXhrResponse(this.responseType, xhr);
            return this;
        }
        AjaxErrorImpl.prototype = Object.create(Error.prototype);
        return AjaxErrorImpl;
    })();
    var AjaxError = AjaxErrorImpl;
    function parseJson(xhr) {
        if ('response' in xhr) {
            return xhr.responseType ? xhr.response : JSON.parse(xhr.response || xhr.responseText || 'null');
        }
        else {
            return JSON.parse(xhr.responseText || 'null');
        }
    }
    function parseXhrResponse(responseType, xhr) {
        switch (responseType) {
            case 'json':
                return parseJson(xhr);
            case 'xml':
                return xhr.responseXML;
            case 'text':
            default:
                return ('response' in xhr) ? xhr.response : xhr.responseText;
        }
    }
    function AjaxTimeoutErrorImpl(xhr, request) {
        AjaxError.call(this, 'ajax timeout', xhr, request);
        this.name = 'AjaxTimeoutError';
        return this;
    }
    var AjaxTimeoutError = AjaxTimeoutErrorImpl;

    var ajax = (function () { return AjaxObservable.create; })();



    var _ajax = /*#__PURE__*/Object.freeze({
        ajax: ajax,
        AjaxResponse: AjaxResponse,
        AjaxError: AjaxError,
        AjaxTimeoutError: AjaxTimeoutError
    });

    var DEFAULT_WEBSOCKET_CONFIG = {
        url: '',
        deserializer: function (e) { return JSON.parse(e.data); },
        serializer: function (value) { return JSON.stringify(value); },
    };
    var WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = 'WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }';
    var WebSocketSubject = (function (_super) {
        __extends(WebSocketSubject, _super);
        function WebSocketSubject(urlConfigOrSource, destination) {
            var _this = _super.call(this) || this;
            if (urlConfigOrSource instanceof Observable) {
                _this.destination = destination;
                _this.source = urlConfigOrSource;
            }
            else {
                var config = _this._config = __assign({}, DEFAULT_WEBSOCKET_CONFIG);
                _this._output = new Subject();
                if (typeof urlConfigOrSource === 'string') {
                    config.url = urlConfigOrSource;
                }
                else {
                    for (var key in urlConfigOrSource) {
                        if (urlConfigOrSource.hasOwnProperty(key)) {
                            config[key] = urlConfigOrSource[key];
                        }
                    }
                }
                if (!config.WebSocketCtor && WebSocket) {
                    config.WebSocketCtor = WebSocket;
                }
                else if (!config.WebSocketCtor) {
                    throw new Error('no WebSocket constructor can be found');
                }
                _this.destination = new ReplaySubject();
            }
            return _this;
        }
        WebSocketSubject.prototype.lift = function (operator) {
            var sock = new WebSocketSubject(this._config, this.destination);
            sock.operator = operator;
            sock.source = this;
            return sock;
        };
        WebSocketSubject.prototype._resetState = function () {
            this._socket = null;
            if (!this.source) {
                this.destination = new ReplaySubject();
            }
            this._output = new Subject();
        };
        WebSocketSubject.prototype.multiplex = function (subMsg, unsubMsg, messageFilter) {
            var self = this;
            return new Observable(function (observer) {
                try {
                    self.next(subMsg());
                }
                catch (err) {
                    observer.error(err);
                }
                var subscription = self.subscribe(function (x) {
                    try {
                        if (messageFilter(x)) {
                            observer.next(x);
                        }
                    }
                    catch (err) {
                        observer.error(err);
                    }
                }, function (err) { return observer.error(err); }, function () { return observer.complete(); });
                return function () {
                    try {
                        self.next(unsubMsg());
                    }
                    catch (err) {
                        observer.error(err);
                    }
                    subscription.unsubscribe();
                };
            });
        };
        WebSocketSubject.prototype._connectSocket = function () {
            var _this = this;
            var _a = this._config, WebSocketCtor = _a.WebSocketCtor, protocol = _a.protocol, url = _a.url, binaryType = _a.binaryType;
            var observer = this._output;
            var socket = null;
            try {
                socket = protocol ?
                    new WebSocketCtor(url, protocol) :
                    new WebSocketCtor(url);
                this._socket = socket;
                if (binaryType) {
                    this._socket.binaryType = binaryType;
                }
            }
            catch (e) {
                observer.error(e);
                return;
            }
            var subscription = new Subscription(function () {
                _this._socket = null;
                if (socket && socket.readyState === 1) {
                    socket.close();
                }
            });
            socket.onopen = function (e) {
                var _socket = _this._socket;
                if (!_socket) {
                    socket.close();
                    _this._resetState();
                    return;
                }
                var openObserver = _this._config.openObserver;
                if (openObserver) {
                    openObserver.next(e);
                }
                var queue = _this.destination;
                _this.destination = Subscriber.create(function (x) {
                    if (socket.readyState === 1) {
                        try {
                            var serializer = _this._config.serializer;
                            socket.send(serializer(x));
                        }
                        catch (e) {
                            _this.destination.error(e);
                        }
                    }
                }, function (e) {
                    var closingObserver = _this._config.closingObserver;
                    if (closingObserver) {
                        closingObserver.next(undefined);
                    }
                    if (e && e.code) {
                        socket.close(e.code, e.reason);
                    }
                    else {
                        observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
                    }
                    _this._resetState();
                }, function () {
                    var closingObserver = _this._config.closingObserver;
                    if (closingObserver) {
                        closingObserver.next(undefined);
                    }
                    socket.close();
                    _this._resetState();
                });
                if (queue && queue instanceof ReplaySubject) {
                    subscription.add(queue.subscribe(_this.destination));
                }
            };
            socket.onerror = function (e) {
                _this._resetState();
                observer.error(e);
            };
            socket.onclose = function (e) {
                _this._resetState();
                var closeObserver = _this._config.closeObserver;
                if (closeObserver) {
                    closeObserver.next(e);
                }
                if (e.wasClean) {
                    observer.complete();
                }
                else {
                    observer.error(e);
                }
            };
            socket.onmessage = function (e) {
                try {
                    var deserializer = _this._config.deserializer;
                    observer.next(deserializer(e));
                }
                catch (err) {
                    observer.error(err);
                }
            };
        };
        WebSocketSubject.prototype._subscribe = function (subscriber) {
            var _this = this;
            var source = this.source;
            if (source) {
                return source.subscribe(subscriber);
            }
            if (!this._socket) {
                this._connectSocket();
            }
            this._output.subscribe(subscriber);
            subscriber.add(function () {
                var _socket = _this._socket;
                if (_this._output.observers.length === 0) {
                    if (_socket && _socket.readyState === 1) {
                        _socket.close();
                    }
                    _this._resetState();
                }
            });
            return subscriber;
        };
        WebSocketSubject.prototype.unsubscribe = function () {
            var _socket = this._socket;
            if (_socket && _socket.readyState === 1) {
                _socket.close();
            }
            this._resetState();
            _super.prototype.unsubscribe.call(this);
        };
        return WebSocketSubject;
    }(AnonymousSubject));

    function webSocket(urlConfigOrSource) {
        return new WebSocketSubject(urlConfigOrSource);
    }



    var _webSocket = /*#__PURE__*/Object.freeze({
        webSocket: webSocket,
        WebSocketSubject: WebSocketSubject
    });

    function fromFetch(input, initWithSelector) {
        if (initWithSelector === void 0) { initWithSelector = {}; }
        var selector = initWithSelector.selector, init = __rest(initWithSelector, ["selector"]);
        return new Observable(function (subscriber) {
            var controller = new AbortController();
            var signal = controller.signal;
            var abortable = true;
            var unsubscribed = false;
            var subscription = new Subscription();
            subscription.add(function () {
                unsubscribed = true;
                if (abortable) {
                    controller.abort();
                }
            });
            var perSubscriberInit;
            if (init) {
                if (init.signal) {
                    if (init.signal.aborted) {
                        controller.abort();
                    }
                    else {
                        var outerSignal_1 = init.signal;
                        var outerSignalHandler_1 = function () {
                            if (!signal.aborted) {
                                controller.abort();
                            }
                        };
                        outerSignal_1.addEventListener('abort', outerSignalHandler_1);
                        subscription.add(function () { return outerSignal_1.removeEventListener('abort', outerSignalHandler_1); });
                    }
                }
                perSubscriberInit = __assign({}, init, { signal: signal });
            }
            else {
                perSubscriberInit = { signal: signal };
            }
            fetch(input, perSubscriberInit).then(function (response) {
                if (selector) {
                    subscription.add(from(selector(response)).subscribe(function (value) { return subscriber.next(value); }, function (err) {
                        abortable = false;
                        if (!unsubscribed) {
                            subscriber.error(err);
                        }
                    }, function () {
                        abortable = false;
                        subscriber.complete();
                    }));
                }
                else {
                    abortable = false;
                    subscriber.next(response);
                    subscriber.complete();
                }
            }).catch(function (err) {
                abortable = false;
                if (!unsubscribed) {
                    subscriber.error(err);
                }
            });
            return subscription;
        });
    }



    var _fetch = /*#__PURE__*/Object.freeze({
        fromFetch: fromFetch
    });

    var operators = _operators;
    var testing = _testing;
    var ajax$1 = _ajax;
    var webSocket$1 = _webSocket;
    var fetch$1 = _fetch;

    exports.operators = operators;
    exports.testing = testing;
    exports.ajax = ajax$1;
    exports.webSocket = webSocket$1;
    exports.fetch = fetch$1;
    exports.Observable = Observable;
    exports.ConnectableObservable = ConnectableObservable;
    exports.GroupedObservable = GroupedObservable;
    exports.observable = observable;
    exports.Subject = Subject;
    exports.BehaviorSubject = BehaviorSubject;
    exports.ReplaySubject = ReplaySubject;
    exports.AsyncSubject = AsyncSubject;
    exports.asap = asap;
    exports.asapScheduler = asapScheduler;
    exports.async = async;
    exports.asyncScheduler = asyncScheduler;
    exports.queue = queue;
    exports.queueScheduler = queueScheduler;
    exports.animationFrame = animationFrame;
    exports.animationFrameScheduler = animationFrameScheduler;
    exports.VirtualTimeScheduler = VirtualTimeScheduler;
    exports.VirtualAction = VirtualAction;
    exports.Scheduler = Scheduler;
    exports.Subscription = Subscription;
    exports.Subscriber = Subscriber;
    exports.Notification = Notification;
    exports.pipe = pipe;
    exports.noop = noop;
    exports.identity = identity;
    exports.isObservable = isObservable;
    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
    exports.EmptyError = EmptyError;
    exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
    exports.UnsubscriptionError = UnsubscriptionError;
    exports.TimeoutError = TimeoutError;
    exports.bindCallback = bindCallback;
    exports.bindNodeCallback = bindNodeCallback;
    exports.combineLatest = combineLatest;
    exports.concat = concat;
    exports.defer = defer;
    exports.empty = empty$1;
    exports.forkJoin = forkJoin;
    exports.from = from;
    exports.fromEvent = fromEvent;
    exports.fromEventPattern = fromEventPattern;
    exports.generate = generate;
    exports.iif = iif;
    exports.interval = interval;
    exports.merge = merge;
    exports.never = never;
    exports.of = of;
    exports.onErrorResumeNext = onErrorResumeNext;
    exports.pairs = pairs;
    exports.partition = partition;
    exports.race = race;
    exports.range = range;
    exports.throwError = throwError;
    exports.timer = timer;
    exports.using = using;
    exports.zip = zip;
    exports.scheduled = scheduled;
    exports.EMPTY = EMPTY;
    exports.NEVER = NEVER;
    exports.config = config;

    Object.defineProperty(exports, '__esModule', { value: true });

})));




/**
 * @license rxcomp v1.0.0-beta.14
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('rxjs'),require('rxjs/operators')):typeof define==='function'&&define.amd?define(['exports','rxjs','rxjs/operators'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.rxcomp={},g.rxjs,g.rxjs.operators));}(this,(function(exports, rxjs, operators){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}var CONTEXTS = {};
var NODES = {};

var Factory = /*#__PURE__*/function () {
  function Factory() {
    this.rxcompId = -1;
    this.unsubscribe$ = new rxjs.Subject();
    this.changes$ = new rxjs.ReplaySubject(1);
  }

  var _proto = Factory.prototype;

  _proto.onInit = function onInit() {};

  _proto.onChanges = function onChanges(changes) {};

  _proto.onView = function onView() {};

  _proto.onDestroy = function onDestroy() {};

  _proto.pushChanges = function pushChanges() {
    var _getContext = getContext(this),
        module = _getContext.module;

    if (module.instances) {
      this.changes$.next(this);
      this.onView();
    }
  };

  return Factory;
}();
function getContext(instance) {
  return CONTEXTS[instance.rxcompId];
}var Directive = /*#__PURE__*/function (_Factory) {
  _inheritsLoose(Directive, _Factory);

  function Directive() {
    return _Factory.apply(this, arguments) || this;
  }

  return Directive;
}(Factory);var ClassDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(ClassDirective, _Directive);

  function ClassDirective() {
    var _this;

    _this = _Directive.apply(this, arguments) || this;
    _this.class = '';
    _this.keys = [];
    return _this;
  }

  var _proto = ClassDirective.prototype;

  _proto.onInit = function onInit() {
    var _this2 = this;

    var _getContext = getContext(this),
        node = _getContext.node;

    Array.prototype.slice.call(node.classList).forEach(function (x) {
      return _this2.keys.push(x);
    });
  };

  _proto.onChanges = function onChanges() {
    var _getContext2 = getContext(this),
        node = _getContext2.node;

    var keys = [];
    var object = this.class;

    if (typeof object === 'object') {
      for (var key in object) {
        if (object[key]) {
          keys.push(key);
        }
      }
    } else if (typeof object === 'string') {
      keys = object.split(/\s+/);
    }

    keys = keys.concat(this.keys); // console.log(keys);

    node.setAttribute('class', keys.join(' ')); // console.log('ClassDirective.onChanges', keys);
  };

  return ClassDirective;
}(Directive);
ClassDirective.meta = {
  selector: "[[class]]",
  inputs: ['class']
};var ModuleError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(ModuleError, _Error);

  function ModuleError() {
    return _Error.apply(this, arguments) || this;
  }

  return ModuleError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var ExpressionError = /*#__PURE__*/function (_Error2) {
  _inheritsLoose(ExpressionError, _Error2);

  function ExpressionError(error, module, instance, expression, params) {
    var _this;

    var message = "ExpressionError in " + instance.constructor.name + " \"" + expression + "\"\n\t\t" + error.message;
    _this = _Error2.call(this, message) || this;
    _this.name = error.name; // this.stack = error.stack;

    _this.module = module;
    _this.instance = instance;
    _this.expression = expression;
    _this.params = params;

    var _getContext = getContext(instance),
        node = _getContext.node;

    _this.template = node.outerHTML;
    return _this;
  }

  return ExpressionError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var ErrorInterceptorHandler = /*#__PURE__*/function () {
  function ErrorInterceptorHandler(next, interceptor) {
    this.next = next;
    this.interceptor = interceptor;
  }

  var _proto = ErrorInterceptorHandler.prototype;

  _proto.handle = function handle(error) {
    return this.interceptor.intercept(error, this.next);
  };

  return ErrorInterceptorHandler;
}();
/*
export class NoopErrorInterceptor implements IErrorInterceptor {
    intercept(error: Error, next: ErrorHandler): Observable<Error> {
        return of(error);
    }
}

const noopInterceptor = new NoopErrorInterceptor();
*/

var DefaultErrorHandler = /*#__PURE__*/function () {
  function DefaultErrorHandler() {}

  var _proto2 = DefaultErrorHandler.prototype;

  _proto2.handle = function handle(error) {
    /*
    if (error) {
        console.error(error);
    }
    */
    return rxjs.of(error);
  };

  return DefaultErrorHandler;
}();
var ErrorInterceptors = [];
var nextError$ = new rxjs.ReplaySubject(1);
var errors$ = nextError$.pipe(
/*
switchMap(error => {
    const chain = ErrorInterceptors.reduceRight((next: ErrorHandler, interceptor: IErrorInterceptor) => {
        return new ErrorInterceptorHandler(next, interceptor);
    }, new NoopErrorInterceptor());
    return chain.handle(error);
}),
*/
// switchMap(error => merge(ErrorInterceptors.map(x => x.intercept(error, next)))),
operators.switchMap(function (error) {
  var chain = ErrorInterceptors.reduceRight(function (next, interceptor) {
    return new ErrorInterceptorHandler(next, interceptor);
  }, new DefaultErrorHandler());
  return chain.handle(error);
}), operators.tap(function (error) {
  if (error) {
    console.error(error);
  }
}));var EVENTS = ['mousedown', 'mouseup', 'mousemove', 'click', 'dblclick', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'contextmenu', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keyup', 'input', 'change', 'loaded'];

var EventDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(EventDirective, _Directive);

  function EventDirective() {
    var _this;

    _this = _Directive.apply(this, arguments) || this;
    _this.event = '';
    return _this;
  }

  var _proto = EventDirective.prototype;

  _proto.onInit = function onInit() {
    var _getContext = getContext(this),
        module = _getContext.module,
        node = _getContext.node,
        parentInstance = _getContext.parentInstance,
        selector = _getContext.selector; // console.log('parentInstance', parentInstance);


    var event = this.event = selector.replace(/\[|\]|\(|\)/g, '');
    var event$ = rxjs.fromEvent(node, event).pipe(operators.shareReplay(1));
    var expression = node.getAttribute("(" + event + ")");

    if (expression) {
      var outputFunction = module.makeFunction(expression, ['$event']);
      event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        module.resolve(outputFunction, parentInstance, event);
      });
    } else {
      parentInstance[event + "$"] = event$;
    } // console.log('EventDirective.onInit', 'selector', selector, 'event', event);

  };

  return EventDirective;
}(Directive);
EventDirective.meta = {
  selector: "[(" + EVENTS.join(')],[(') + ")]"
};var Structure = /*#__PURE__*/function (_Factory) {
  _inheritsLoose(Structure, _Factory);

  function Structure() {
    return _Factory.apply(this, arguments) || this;
  }

  return Structure;
}(Factory);var Component = /*#__PURE__*/function (_Factory) {
  _inheritsLoose(Component, _Factory);

  function Component() {
    return _Factory.apply(this, arguments) || this;
  }

  var _proto = Component.prototype;

  _proto.pushChanges = function pushChanges() {
    var _getContext = getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    if (module.instances) {
      // console.log(new Error(`pushChanges ${instance.constructor.name}`).stack);
      this.changes$.next(this); // console.log('Module.parse', instance.constructor.name);
      // parse component text nodes

      module.parse(node, this); // calling onView event

      this.onView();
    }
  };

  return Component;
}(Factory);var RESERVED_PROPERTIES = ['constructor', 'rxcompId', 'onInit', 'onChanges', 'onDestroy', 'pushChanges', 'changes$', 'unsubscribe$'];

var Context = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Context, _Component);

  function Context(parentInstance, descriptors) {
    var _this;

    if (descriptors === void 0) {
      descriptors = {};
    }

    _this = _Component.call(this) || this;
    descriptors = Context.mergeDescriptors(parentInstance, parentInstance, descriptors);
    descriptors = Context.mergeDescriptors(Object.getPrototypeOf(parentInstance), parentInstance, descriptors);
    Object.defineProperties(_assertThisInitialized(_this), descriptors);
    return _this;
  }

  var _proto = Context.prototype;

  _proto.pushChanges = function pushChanges() {
    var _this2 = this;

    var context = getContext(this);

    if (!context.keys) {
      context.keys = Object.keys(context.parentInstance).filter(function (key) {
        return RESERVED_PROPERTIES.indexOf(key) === -1;
      }); // console.log(context.keys.join(','));
    }

    if (context.module.instances) {
      context.keys.forEach(function (key) {
        _this2[key] = context.parentInstance[key];
      });
    }

    _Component.prototype.pushChanges.call(this);
  };

  Context.mergeDescriptors = function mergeDescriptors(source, instance, descriptors) {
    if (descriptors === void 0) {
      descriptors = {};
    }

    var properties = Object.getOwnPropertyNames(source);

    var _loop = function _loop() {
      var key = properties.shift();

      if (RESERVED_PROPERTIES.indexOf(key) === -1 && !descriptors.hasOwnProperty(key)) {
        var descriptor = Object.getOwnPropertyDescriptor(source, key);

        if (typeof descriptor.value == 'function') {
          descriptor.value = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return instance[key].apply(instance, args);
          };
        }

        descriptors[key] = descriptor;
      }
    };

    while (properties.length) {
      _loop();
    }

    return descriptors;
  };

  return Context;
}(Component);var ForItem = /*#__PURE__*/function (_Context) {
  _inheritsLoose(ForItem, _Context);

  // !!! todo: payload options { key, $key, value, $value, index, count }
  function ForItem(key, $key, value, $value, index, count, parentInstance) {
    var _this;

    // console.log('ForItem', arguments);
    _this = _Context.call(this, parentInstance) || this;
    /*
    super(parentInstance, {
        [key]: {
            get: function() {
                return this.$key;
            },
            set: function(key) {
                this.$key = key;
            }
        },
        [value]: {
            get: function() {
                return this.$value;
            },
            set: function(value) {
                this.$value = value;
            }
        }
    });
    */

    _this[key] = $key;
    _this[value] = $value;
    _this.index = index;
    _this.count = count;
    return _this;
  }

  _createClass(ForItem, [{
    key: "first",
    get: function get() {
      return this.index === 0;
    }
  }, {
    key: "last",
    get: function get() {
      return this.index === this.count - 1;
    }
  }, {
    key: "even",
    get: function get() {
      return this.index % 2 === 0;
    }
  }, {
    key: "odd",
    get: function get() {
      return !this.even;
    }
  }]);

  return ForItem;
}(Context);var ForStructure = /*#__PURE__*/function (_Structure) {
  _inheritsLoose(ForStructure, _Structure);

  function ForStructure() {
    var _this;

    _this = _Structure.apply(this, arguments) || this;
    _this.instances = [];
    return _this;
  }

  var _proto = ForStructure.prototype;

  _proto.onInit = function onInit() {
    var _getContext = getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    var forbegin = document.createComment("*for begin");
    forbegin.rxcompId = node.rxcompId;
    node.parentNode.replaceChild(forbegin, node);
    var forend = this.forend = document.createComment("*for end");
    forbegin.parentNode.insertBefore(forend, forbegin.nextSibling);
    var expression = node.getAttribute('*for');
    node.removeAttribute('*for');
    var token = this.token = this.getExpressionToken(expression);
    this.forFunction = module.makeFunction(token.iterable);
  };

  _proto.onChanges = function onChanges(changes) {
    var context = getContext(this);
    var module = context.module;
    var node = context.node; // resolve

    var token = this.token;
    var result = module.resolve(this.forFunction, changes, this) || [];
    var isArray = Array.isArray(result);
    var array = isArray ? result : Object.keys(result);
    var total = array.length;
    var previous = this.instances.length;

    for (var i = 0; i < Math.max(previous, total); i++) {
      if (i < total) {
        var key = isArray ? i : array[i];
        var value = isArray ? array[key] : result[key];

        if (i < previous) {
          // update
          var instance = this.instances[i];
          instance[token.key] = key;
          instance[token.value] = value;
          /*
          if (!nextSibling) {
              const context = getContext(instance);
              const node = context.node;
              this.forend.parentNode.insertBefore(node, this.forend);
          } else {
              nextSibling = nextSibling.nextSibling;
          }
          */
        } else {
          // create
          var clonedNode = node.cloneNode(true);
          delete clonedNode.rxcompId;
          this.forend.parentNode.insertBefore(clonedNode, this.forend); // !!! todo: check context.parentInstance

          var args = [token.key, key, token.value, value, i, total, context.parentInstance];

          var _instance = module.makeInstance(clonedNode, ForItem, context.selector, context.parentInstance, args);

          if (_instance) {
            // const forItemContext = getContext(instance);
            // console.log('ForStructure', clonedNode, forItemContext.instance.constructor.name);
            // module.compile(clonedNode, forItemContext.instance);
            module.compile(clonedNode, _instance); // nextSibling = clonedNode.nextSibling;

            this.instances.push(_instance);
          }
        }
      } else {
        // remove
        var _instance2 = this.instances[i];

        var _getContext2 = getContext(_instance2),
            _node = _getContext2.node;

        _node.parentNode.removeChild(_node);

        module.remove(_node);
      }
    }

    this.instances.length = array.length; // console.log('ForStructure', this.instances, token);
  };

  _proto.getExpressionToken = function getExpressionToken(expression) {
    if (expression === null) {
      throw new Error('invalid for');
    }

    if (expression.trim().indexOf('let ') === -1 || expression.trim().indexOf(' of ') === -1) {
      throw new Error('invalid for');
    }

    var expressions = expression.split(';').map(function (x) {
      return x.trim();
    }).filter(function (x) {
      return x !== '';
    });
    var forExpressions = expressions[0].split(' of ').map(function (x) {
      return x.trim();
    });
    var value = forExpressions[0].replace(/\s*let\s*/, '');
    var iterable = forExpressions[1];
    var key = 'index';
    var keyValueMatches = value.match(/\[(.+)\s*,\s*(.+)\]/);

    if (keyValueMatches) {
      key = keyValueMatches[1];
      value = keyValueMatches[2];
    }

    if (expressions.length > 1) {
      var indexExpressions = expressions[1].split(/\s*let\s*|\s*=\s*index/).map(function (x) {
        return x.trim();
      });

      if (indexExpressions.length === 3) {
        key = indexExpressions[1];
      }
    }

    return {
      key: key,
      value: value,
      iterable: iterable
    };
  };

  return ForStructure;
}(Structure);
ForStructure.meta = {
  selector: '[*for]'
};var HrefDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(HrefDirective, _Directive);

  function HrefDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  _createClass(HrefDirective, [{
    key: "href",
    set: function set(href) {
      if (this.href_ !== href) {
        this.href_ = href;

        var _getContext = getContext(this),
            node = _getContext.node;

        href ? node.setAttribute('href', href) : node.removeAttribute('href');
      }
    },
    get: function get() {
      return this.href_;
    }
  }]);

  return HrefDirective;
}(Directive);
HrefDirective.meta = {
  selector: '[[href]]',
  inputs: ['href']
};var IfStructure = /*#__PURE__*/function (_Structure) {
  _inheritsLoose(IfStructure, _Structure);

  function IfStructure() {
    return _Structure.apply(this, arguments) || this;
  }

  var _proto = IfStructure.prototype;

  _proto.onInit = function onInit() {
    var _getContext = getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    var ifbegin = this.ifbegin = document.createComment("*if begin");
    ifbegin.rxcompId = node.rxcompId;
    node.parentNode.replaceChild(ifbegin, node);
    var ifend = this.ifend = document.createComment("*if end");
    ifbegin.parentNode.insertBefore(ifend, ifbegin.nextSibling);
    var expression = node.getAttribute('*if');
    this.ifFunction = module.makeFunction(expression);
    var clonedNode = node.cloneNode(true);
    clonedNode.removeAttribute('*if');
    this.clonedNode = clonedNode;
    this.element = clonedNode.cloneNode(true); // console.log('IfStructure.expression', expression);
  };

  _proto.onChanges = function onChanges(changes) {
    var _getContext2 = getContext(this),
        module = _getContext2.module; // console.log('IfStructure.onChanges', changes);


    var value = module.resolve(this.ifFunction, changes, this);
    var element = this.element;

    if (value) {
      if (!element.parentNode) {
        var ifend = this.ifend;
        ifend.parentNode.insertBefore(element, ifend);
        module.compile(element);
      }
    } else {
      if (element.parentNode) {
        module.remove(element, this);
        element.parentNode.removeChild(element);
        this.element = this.clonedNode.cloneNode(true);
      }
    }
  };

  return IfStructure;
}(Structure);
IfStructure.meta = {
  selector: '[*if]'
};var InnerHtmlDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(InnerHtmlDirective, _Directive);

  function InnerHtmlDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  _createClass(InnerHtmlDirective, [{
    key: "innerHTML",
    set: function set(innerHTML) {
      if (this.innerHTML_ !== innerHTML) {
        this.innerHTML_ = innerHTML;

        var _getContext = getContext(this),
            node = _getContext.node;

        node.innerHTML = innerHTML == undefined ? '' : innerHTML; // !!! keep == loose equality
      }
    },
    get: function get() {
      return this.innerHTML_;
    }
  }]);

  return InnerHtmlDirective;
}(Directive);
InnerHtmlDirective.meta = {
  selector: "[innerHTML]",
  inputs: ['innerHTML']
};var JsonComponent = /*#__PURE__*/function (_Component) {
  _inheritsLoose(JsonComponent, _Component);

  function JsonComponent() {
    var _this;

    _this = _Component.apply(this, arguments) || this;
    _this.active = false;
    return _this;
  }

  var _proto = JsonComponent.prototype;

  _proto.onToggle = function onToggle() {
    this.active = !this.active;
    this.pushChanges();
  };

  return JsonComponent;
}(Component);
JsonComponent.meta = {
  selector: 'json-component',
  inputs: ['item'],
  template: "\n\t\t<div class=\"rxc-block\">\n\t\t\t<div class=\"rxc-head\">\n\t\t\t\t<span class=\"rxc-head__title\" (click)=\"onToggle()\">\n\t\t\t\t\t<span *if=\"!active\">+ json </span>\n\t\t\t\t\t<span *if=\"active\">- json </span>\n\t\t\t\t\t<span [innerHTML]=\"item\"></span>\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t\t<ul class=\"rxc-list\" *if=\"active\">\n\t\t\t\t<li class=\"rxc-list__item\">\n\t\t\t\t\t<span class=\"rxc-list__value\" [innerHTML]=\"item | json\"></span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>"
};var Pipe = /*#__PURE__*/function () {
  function Pipe() {}

  Pipe.transform = function transform(value) {
    return value;
  };

  return Pipe;
}();var ORDER = [Structure, Component, Directive];

var Platform = /*#__PURE__*/function () {
  function Platform() {}

  /**
   * @param moduleFactory
   * @description This method returns an uncompiled module
   */
  Platform.bootstrap = function bootstrap(moduleFactory) {
    if (!moduleFactory) {
      throw new ModuleError('missing moduleFactory');
    }

    if (!moduleFactory.meta) {
      throw new ModuleError('missing moduleFactory meta');
    }

    if (!moduleFactory.meta.bootstrap) {
      throw new ModuleError('missing bootstrap');
    }

    if (!moduleFactory.meta.bootstrap.meta) {
      throw new ModuleError('missing bootstrap meta');
    }

    if (!moduleFactory.meta.bootstrap.meta.selector) {
      throw new ModuleError('missing bootstrap meta selector');
    }

    var meta = this.resolveMeta(moduleFactory);
    var module = new moduleFactory();
    module.meta = meta;
    meta.imports.forEach(function (moduleFactory) {
      moduleFactory.prototype.constructor.call(module);
    }); // const instances = module.compile(meta.node, window);
    // module.instances = instances;
    // const root = instances[0];
    // root.pushChanges();

    return module;
  };

  Platform.querySelector = function querySelector(selector) {
    return document.querySelector(selector);
  };

  Platform.resolveMeta = function resolveMeta(moduleFactory) {
    var meta = this.resolveImportedMeta(moduleFactory);
    var bootstrap = moduleFactory.meta.bootstrap;
    var node = this.querySelector(bootstrap.meta.selector);

    if (!node) {
      throw new ModuleError("missing node " + bootstrap.meta.selector);
    }

    var nodeInnerHTML = node.innerHTML;
    var pipes = this.resolvePipes(meta);
    var factories = this.resolveFactories(meta);
    this.sortFactories(factories);
    factories.unshift(bootstrap);
    var selectors = this.unwrapSelectors(factories);
    return {
      factories: factories,
      pipes: pipes,
      selectors: selectors,
      bootstrap: bootstrap,
      node: node,
      nodeInnerHTML: nodeInnerHTML,
      imports: moduleFactory.meta.imports || []
    };
  };

  Platform.resolveImportedMeta = function resolveImportedMeta(moduleFactory) {
    var _this = this;

    var meta = Object.assign({
      imports: [],
      declarations: [],
      pipes: [],
      exports: []
    }, moduleFactory.meta);
    meta.imports = (moduleFactory.meta.imports || []).map(function (moduleFactory) {
      return _this.resolveImportedMeta(moduleFactory);
    });
    return meta;
  };

  Platform.resolvePipes = function resolvePipes(meta, exported) {
    var _this2 = this;

    var importedPipes = meta.imports.map(function (importMeta) {
      return _this2.resolvePipes(importMeta, true);
    });
    var pipes = {};
    var pipeList = (exported ? meta.exports : meta.declarations).filter(function (x) {
      return x.prototype instanceof Pipe;
    });
    pipeList.forEach(function (pipeFactory) {
      return pipes[pipeFactory.meta.name] = pipeFactory;
    });
    return Object.assign.apply(Object, [{}].concat(importedPipes, [pipes]));
  };

  Platform.resolveFactories = function resolveFactories(meta, exported) {
    var _this3 = this,
        _Array$prototype$conc;

    var importedFactories = meta.imports.map(function (importMeta) {
      return _this3.resolveFactories(importMeta, true);
    });
    var factoryList = (exported ? meta.exports : meta.declarations).filter(function (x) {
      return x.prototype instanceof Factory;
    });
    return (_Array$prototype$conc = Array.prototype.concat).call.apply(_Array$prototype$conc, [factoryList].concat(importedFactories));
  };

  Platform.sortFactories = function sortFactories(factories) {
    factories.sort(function (a, b) {
      var ai = ORDER.reduce(function (p, c, i) {
        return a.prototype instanceof c ? i : p;
      }, -1);
      var bi = ORDER.reduce(function (p, c, i) {
        return b.prototype instanceof c ? i : p;
      }, -1); // return ai - bi;

      var o = ai - bi;

      if (o === 0) {
        return (a.meta.hosts ? 1 : 0) - (b.meta.hosts ? 1 : 0);
      }

      return o;
    });
  };

  Platform.getExpressions = function getExpressions(selector) {
    var matchers = [];
    selector.replace(/\.([\w\-\_]+)|\[(.+?\]*)(\=)(.*?)\]|\[(.+?\]*)\]|([\w\-\_]+)/g, function (value, c1, a2, u3, v4, a5, e6) {
      if (c1) {
        matchers.push(function (node) {
          return node.classList.contains(c1);
        });
      }

      if (a2) {
        matchers.push(function (node) {
          return node.hasAttribute(a2) && node.getAttribute(a2) === v4 || node.hasAttribute("[" + a2 + "]") && node.getAttribute("[" + a2 + "]") === v4;
        });
      }

      if (a5) {
        matchers.push(function (node) {
          return node.hasAttribute(a5) || node.hasAttribute("[" + a5 + "]");
        });
      }

      if (e6) {
        matchers.push(function (node) {
          return node.nodeName.toLowerCase() === e6.toLowerCase();
        });
      }

      return '';
    });
    return matchers;
  };

  Platform.unwrapSelectors = function unwrapSelectors(factories) {
    var _this4 = this;

    var selectors = [];
    factories.forEach(function (factory) {
      if (factory.meta && factory.meta.selector) {
        factory.meta.selector.split(',').forEach(function (selector) {
          selector = selector.trim();
          var excludes = [];
          var matchSelector = selector.replace(/\:not\((.+?)\)/g, function (value, unmatchSelector) {
            excludes = _this4.getExpressions(unmatchSelector);
            return '';
          });

          var includes = _this4.getExpressions(matchSelector);

          selectors.push(function (node) {
            var included = includes.reduce(function (p, match) {
              return p && match(node);
            }, true);
            var excluded = excludes.reduce(function (p, match) {
              return p || match(node);
            }, false);

            if (included && !excluded) {
              return {
                node: node,
                factory: factory,
                selector: selector
              };
            } else {
              return false;
            }
          });
        });
      }
    });
    return selectors;
  };

  return Platform;
}();
var PLATFORM_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
/* eslint-disable no-undef */

var PLATFORM_JS_DOM = typeof window !== 'undefined' && window.name === 'nodejs' || typeof navigator !== 'undefined' && navigator.userAgent.includes('Node.js') || typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom');
/* eslint-enable no-undef */

var PLATFORM_NODE = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
/* eslint-disable no-restricted-globals */

var PLATFORM_WEB_WORKER = typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
var isPlatformServer = PLATFORM_NODE;
var isPlatformBrowser = !PLATFORM_NODE && PLATFORM_BROWSER;
var isPlatformWorker = PLATFORM_WEB_WORKER;var Serializer = /*#__PURE__*/function () {
  function Serializer() {}

  Serializer.encode = function encode(value, encoders) {
    if (encoders === void 0) {
      encoders = [_encodeJson];
    }

    return encoders.reduce(function (p, c) {
      return c(p);
    }, value);
  };

  Serializer.decode = function decode(value, decoders) {
    if (decoders === void 0) {
      decoders = [_decodeJson];
    }

    return decoders.reduce(function (p, c) {
      return c(p);
    }, value);
  };

  Serializer.encodeJson = function encodeJson(value) {
    return this.encode(value, [_encodeJson]);
  };

  Serializer.decodeJson = function decodeJson(value) {
    return this.decode(value, [_decodeJson]);
  };

  Serializer.encodeBase64 = function encodeBase64(value) {
    return this.encode(value, [_encodeJson, _encodeBase]);
  };

  Serializer.decodeBase64 = function decodeBase64(value) {
    return this.decode(value, [_decodeBase, _decodeJson]);
  };

  return Serializer;
}();

function _encodeJson(value, circularRef, space) {
  var decoded;

  try {
    // const pool: Map<any, boolean> = new Map();
    var pool = [];
    var json = JSON.stringify(value, function (key, value) {
      if (typeof value === 'object' && value != null) {
        // if (pool.has(value)) {
        if (pool.indexOf(value) !== -1) {
          // console.warn(`Serializer.encodeJson.error`, `circular reference found, discard key "${key}"`);
          return circularRef;
        }

        pool.push(value); // pool.set(value, true);
      }

      return value;
    }, space);
    decoded = json;
  } catch (error) {// console.warn(`Serializer.encodeJson.error`, value, error);
  }

  return decoded;
}
function encodeJsonWithOptions(circularRef, space) {
  return function (value) {
    return _encodeJson(value, circularRef, space);
  };
}

function _decodeJson(value) {
  var decoded;

  if (value) {
    try {
      decoded = JSON.parse(value);
    } catch (error) {// console.warn(`Serializer.decodeJson.error`, value, error);
    }
  }

  return decoded;
}

function _encodeBase(value) {
  var encoded;

  try {
    encoded = isPlatformBrowser ? btoa(value) : Buffer.from(value).toString('base64');
  } catch (error) {
    encoded = value;
  }

  return encoded;
}

function _decodeBase(value) {
  var decoded;

  try {
    decoded = isPlatformBrowser ? atob(value) : Buffer.from(value, 'base64').toString();
  } catch (error) {
    decoded = value;
  }

  return decoded;
}var JsonPipe = /*#__PURE__*/function (_Pipe) {
  _inheritsLoose(JsonPipe, _Pipe);

  function JsonPipe() {
    return _Pipe.apply(this, arguments) || this;
  }

  JsonPipe.transform = function transform(value) {
    return Serializer.encode(value, [encodeJsonWithOptions('#ref', 2)]);
  };

  return JsonPipe;
}(Pipe);
JsonPipe.meta = {
  name: 'json'
};var ID = 0;

var Module = /*#__PURE__*/function () {
  function Module() {
    this.unsubscribe$ = new rxjs.Subject();
  }

  var _proto = Module.prototype;

  _proto.compile = function compile(node, parentInstance) {
    var _this = this;

    var componentNode;
    var instances = Module.querySelectorsAll(node, this.meta.selectors, []).map(function (match) {
      if (componentNode && componentNode !== match.node) {
        parentInstance = undefined;
      }

      var instance = _this.makeInstance(match.node, match.factory, match.selector, parentInstance);

      if (match.factory.prototype instanceof Component) {
        componentNode = match.node;
      }

      return instance;
    }).filter(function (x) {
      return x !== undefined;
    }); // instances.forEach(x => x.onInit());
    // console.log('compile', instances, node, parentInstance);

    return instances;
  };

  _proto.makeInstance = function makeInstance(node, factory, selector, parentInstance, args, inject) {
    var _this2 = this;

    if (parentInstance || node.parentNode) {
      var meta = factory.meta; // collect parentInstance scope

      parentInstance = parentInstance || this.getParentInstance(node.parentNode);

      if (!parentInstance) {
        return undefined;
      } // creating factory instance


      var instance = _construct(factory, args || []); // injecting custom properties


      if (inject) {
        Object.keys(inject).forEach(function (key) {
          Object.defineProperty(instance, key, {
            value: inject[key],
            enumerable: true,
            configurable: false,
            writable: false
          });
        });
      } // creating instance context


      var context = Module.makeContext(this, instance, parentInstance, node, factory, selector); // creating component input and outputs

      if (meta) {
        this.makeHosts(meta, instance, node);
        context.inputs = this.makeInputs(meta, instance);
        context.outputs = this.makeOutputs(meta, instance);

        if (parentInstance instanceof Factory) {
          this.resolveInputsOutputs(instance, parentInstance);
        }
      } // calling onInit event


      instance.onInit(); // subscribe to parent changes

      if (parentInstance instanceof Factory) {
        parentInstance.changes$.pipe( // filter(() => node.parentNode),
        // debounceTime(1),

        /*
        distinctUntilChanged(function(prev, curr) {
            // console.log(isComponent, context.inputs);
            if (isComponent && meta && Object.keys(context.inputs).length === 0) {
                return true; // same
            } else {
                return false;
            }
        }),
        */
        operators.takeUntil(instance.unsubscribe$)).subscribe(function (changes) {
          // resolve component input outputs
          if (meta) {
            _this2.resolveInputsOutputs(instance, changes);
          } // calling onChanges event with changes


          instance.onChanges(changes); // push instance changes for subscribers

          instance.pushChanges();
        });
      }

      return instance;
    } else {
      return undefined;
    }
  };

  _proto.makeFunction = function makeFunction(expression, params) {
    if (params === void 0) {
      params = ['$instance'];
    }

    if (expression) {
      expression = Module.parseExpression(expression); // console.log(expression);

      var args = params.join(',');
      var expression_func = new Function("with(this) {\n\t\t\t\treturn (function (" + args + ", $$module) {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tconst $$pipes = $$module.meta.pipes;\n\t\t\t\t\t\treturn " + expression + ";\n\t\t\t\t\t} catch(error) {\n\t\t\t\t\t\t$$module.nextError(error, this, " + JSON.stringify(expression) + ", arguments);\n\t\t\t\t\t}\n\t\t\t\t}.bind(this)).apply(this, arguments);\n\t\t\t}"); // console.log(this, $$module, $$pipes, "${expression}");
      // console.log(expression_func);

      return expression_func;
    } else {
      return function () {
        return null;
      };
    }
  };

  _proto.nextError = function nextError(error, instance, expression, params) {
    var expressionError = new ExpressionError(error, this, instance, expression, params);
    nextError$.next(expressionError);
  };

  _proto.resolve = function resolve(expression, parentInstance, payload) {
    // console.log(expression, parentInstance, payload);
    return expression.apply(parentInstance, [payload, this]);
  };

  _proto.parse = function parse(node, instance) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];

      if (child.nodeType === 1) {
        var element = child;
        var context = getParsableContextByNode(element);

        if (!context) {
          this.parse(element, instance);
        }
      } else if (child.nodeType === 3) {
        var text = child;
        this.parseTextNode(text, instance);
      }
    }
  };

  _proto.remove = function remove(node, keepInstance) {
    var keepContext = keepInstance ? getContext(keepInstance) : undefined;
    Module.traverseDown(node, function (node) {
      var rxcompId = node.rxcompId;

      if (rxcompId) {
        var keepContexts = Module.deleteContext(rxcompId, keepContext);

        if (keepContexts.length === 0) {
          delete node.rxcompId;
        }
      }
    });
    return node;
  };

  _proto.destroy = function destroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.remove(this.meta.node);
    this.meta.node.innerHTML = this.meta.nodeInnerHTML;
  };

  _proto.makeContext = function makeContext(instance, parentInstance, node, selector) {
    var context = Module.makeContext(this, instance, parentInstance, node, instance.constructor, selector); // console.log('Module.makeContext', context, context.instance, context.node);

    return context;
  };

  _proto.getInstance = function getInstance(node) {
    if (node === document) {
      return isPlatformBrowser ? window : global;
    }

    var context = getContextByNode(node);

    if (context) {
      return context.instance;
    } else {
      return undefined;
    }
  };

  _proto.getParentInstance = function getParentInstance(node) {
    var _this3 = this;

    return Module.traverseUp(node, function (node) {
      return _this3.getInstance(node);
    });
  } // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
  ;

  _proto.parseTextNode = function parseTextNode(node, instance) {
    var _this4 = this;

    var expressions = node.nodeExpressions;

    if (!expressions) {
      expressions = this.parseTextNodeExpression(node.wholeText);
    }

    if (expressions.length) {
      var replacedText = expressions.reduce(function (p, c) {
        var text;

        if (typeof c === 'function') {
          // instanceOf ExpressionFunction ?;
          text = _this4.resolve(c, instance, instance);

          if (text == undefined) {
            // !!! keep == loose equality
            text = '';
          }
        } else {
          text = c;
        }

        return p + text;
      }, '');

      if (node.nodeValue !== replacedText) {
        var textNode = document.createTextNode(replacedText);
        textNode.nodeExpressions = expressions;
        node.parentNode.replaceChild(textNode, node);
      }
    } else {
      node.nodeExpressions = expressions;
    }
  };

  _proto.pushFragment = function pushFragment(nodeValue, from, to, expressions) {
    var fragment = nodeValue.substring(from, to);
    expressions.push(fragment);
  };

  _proto.parseTextNodeExpression = function parseTextNodeExpression(nodeValue) {
    var expressions = [];
    var regex = /\{{2}((([^{}])|(\{([^{}]|(\{.*?\}))+?\}))*?)\}{2}/g;
    var lastIndex = 0,
        matches;

    while ((matches = regex.exec(nodeValue)) !== null) {
      var index = regex.lastIndex - matches[0].length;

      if (index > lastIndex) {
        this.pushFragment(nodeValue, index, lastIndex, expressions);
      }

      lastIndex = regex.lastIndex;
      var expression = this.makeFunction(matches[1]);
      expressions.push(expression);
    }

    var length = nodeValue.length;

    if (length > lastIndex) {
      this.pushFragment(nodeValue, lastIndex, length, expressions);
    }

    if (expressions.find(function (x) {
      return typeof x === 'function';
    })) {
      return expressions;
    } else {
      return [];
    }
  };

  _proto.makeHosts = function makeHosts(meta, instance, node) {
    if (meta.hosts) {
      Object.keys(meta.hosts).forEach(function (key) {
        var factory = meta.hosts[key];
        instance[key] = getHost(instance, factory, node);
      });
    }
  };

  _proto.makeInput = function makeInput(instance, key) {
    var _getContext = getContext(instance),
        node = _getContext.node;

    var input = null,
        expression = null;

    if (node.hasAttribute("[" + key + "]")) {
      expression = node.getAttribute("[" + key + "]");
    } else if (node.hasAttribute(key)) {
      // const attribute = node.getAttribute(key).replace(/{{/g, '"+').replace(/}}/g, '+"');
      var attribute = node.getAttribute(key).replace(/({{)|(}})|(")/g, function (substring, a, b, c) {
        if (a) {
          return '"+';
        }

        if (b) {
          return '+"';
        }

        if (c) {
          return '\"';
        }

        return '';
      });
      expression = "\"" + attribute + "\"";
    }

    if (expression) {
      input = this.makeFunction(expression);
    }

    return input;
  };

  _proto.makeInputs = function makeInputs(meta, instance) {
    var _this5 = this;

    var inputs = {};

    if (meta.inputs) {
      meta.inputs.forEach(function (key, i) {
        var input = _this5.makeInput(instance, key);

        if (input) {
          inputs[key] = input;
        }
      });
    }

    return inputs;
  };

  _proto.makeOutput = function makeOutput(instance, key) {
    var _this6 = this;

    var context = getContext(instance);
    var node = context.node;
    var parentInstance = context.parentInstance;
    var expression = node.getAttribute("(" + key + ")");
    var outputFunction = expression ? this.makeFunction(expression, ['$event']) : null;
    var output$ = new rxjs.Subject().pipe(operators.tap(function (event) {
      if (outputFunction) {
        // console.log(expression, parentInstance);
        _this6.resolve(outputFunction, parentInstance, event);
      }
    }));
    output$.pipe(operators.takeUntil(instance.unsubscribe$)).subscribe();
    instance[key] = output$;
    return output$;
  };

  _proto.makeOutputs = function makeOutputs(meta, instance) {
    var _this7 = this;

    var outputs = {};

    if (meta.outputs) {
      meta.outputs.forEach(function (key) {
        var output = _this7.makeOutput(instance, key);

        if (output) {
          outputs[key] = output;
        }
      });
    }

    return outputs;
  };

  _proto.resolveInputsOutputs = function resolveInputsOutputs(instance, changes) {
    var context = getContext(instance);
    var parentInstance = context.parentInstance;
    var inputs = context.inputs;

    for (var key in inputs) {
      var inputFunction = inputs[key];
      var value = this.resolve(inputFunction, parentInstance, instance);
      instance[key] = value;
    }
  };

  Module.parseExpression = function parseExpression(expression) {
    var l = '┌';
    var r = '┘';
    var rx1 = /(\()([^\(\)]*)(\))/;

    while (expression.match(rx1)) {
      expression = expression.replace(rx1, function (substring) {
        return "" + l + Module.parsePipes(arguments.length <= 2 ? undefined : arguments[2]) + r;
      });
    }

    expression = Module.parsePipes(expression);
    expression = expression.replace(/(┌)|(┘)/g, function (substring) {
      return (arguments.length <= 1 ? undefined : arguments[1]) ? '(' : ')';
    });
    return Module.parseOptionalChaining(expression);
  };

  Module.parsePipes = function parsePipes(expression) {
    var l = '┌';
    var r = '┘';
    var rx1 = /(.*?[^\|])\|([^\|]+)/;

    while (expression.match(rx1)) {
      expression = expression.replace(rx1, function (substring) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var value = args[0].trim();
        var params = Module.parsePipeParams(args[1]);
        var func = params.shift().trim();
        return "$$pipes." + func + ".transform" + l + [value].concat(params) + r;
      });
    }

    return expression;
  };

  Module.parsePipeParams = function parsePipeParams(expression) {
    var segments = [];
    var i = 0,
        word = '',
        block = 0;
    var t = expression.length;

    while (i < t) {
      var c = expression.substr(i, 1);

      if (c === '{' || c === '(' || c === '[') {
        block++;
      }

      if (c === '}' || c === ')' || c === ']') {
        block--;
      }

      if (c === ':' && block === 0) {
        if (word.length) {
          segments.push(word.trim());
        }

        word = '';
      } else {
        word += c;
      }

      i++;
    }

    if (word.length) {
      segments.push(word.trim());
    }

    return segments;
  };

  Module.parseOptionalChaining = function parseOptionalChaining(expression) {
    var regex = /(\w+(\?\.))+([\.|\w]+)/g;
    var previous;
    expression = expression.replace(regex, function (substring) {
      var tokens = substring.split('?.');

      for (var i = 0; i < tokens.length - 1; i++) {
        var a = i > 0 ? "(" + tokens[i] + " = " + previous + ")" : tokens[i];
        var b = tokens[i + 1];
        previous = i > 0 ? a + "." + b : "(" + a + " ? " + a + "." + b + " : void 0)";
      }

      return previous || '';
    });
    return expression;
  };

  Module.makeContext = function makeContext(module, instance, parentInstance, node, factory, selector) {
    instance.rxcompId = ++ID;
    var context = {
      module: module,
      instance: instance,
      parentInstance: parentInstance,
      node: node,
      factory: factory,
      selector: selector
    };
    var rxcompNodeId = node.rxcompId = node.rxcompId || instance.rxcompId;
    var nodeContexts = NODES[rxcompNodeId] || (NODES[rxcompNodeId] = []);
    nodeContexts.push(context);
    CONTEXTS[instance.rxcompId] = context;
    return context;
  };

  Module.deleteContext = function deleteContext(id, keepContext) {
    var keepContexts = [];
    var nodeContexts = NODES[id];

    if (nodeContexts) {
      nodeContexts.forEach(function (context) {
        if (context === keepContext) {
          keepContexts.push(keepContext);
        } else {
          var instance = context.instance;
          instance.unsubscribe$.next();
          instance.unsubscribe$.complete();
          instance.onDestroy();
          delete CONTEXTS[instance.rxcompId];
        }
      });

      if (keepContexts.length) {
        NODES[id] = keepContexts;
      } else {
        delete NODES[id];
      }
    }

    return keepContexts;
  };

  Module.matchSelectors = function matchSelectors(node, selectors, results) {
    for (var i = 0; i < selectors.length; i++) {
      var selectorResult = selectors[i](node);

      if (selectorResult) {
        var factory = selectorResult.factory;

        if (factory.prototype instanceof Component && factory.meta.template) {
          node.innerHTML = factory.meta.template;
        }

        results.push(selectorResult);

        if (factory.prototype instanceof Structure) {
          // console.log('Structure', node);
          break;
        }
      }
    }

    return results;
  };

  Module.querySelectorsAll = function querySelectorsAll(node, selectors, results) {
    if (node.nodeType === 1) {
      var selectorResults = this.matchSelectors(node, selectors, []);
      results = results.concat(selectorResults);
      var structure = selectorResults.find(function (x) {
        return x.factory.prototype instanceof Structure;
      });

      if (structure) {
        return results;
      }

      var childNodes = node.childNodes;

      for (var i = 0; i < childNodes.length; i++) {
        results = this.querySelectorsAll(childNodes[i], selectors, results);
      }
    }

    return results;
  };

  Module.traverseUp = function traverseUp(node, callback, i) {
    if (i === void 0) {
      i = 0;
    }

    if (!node) {
      return;
    }

    var result = callback(node, i);

    if (result) {
      return result;
    }

    return this.traverseUp(node.parentNode, callback, i + 1);
  };

  Module.traverseDown = function traverseDown(node, callback, i) {
    if (i === void 0) {
      i = 0;
    }

    if (!node) {
      return;
    }

    var result = callback(node, i);

    if (result) {
      return result;
    }

    if (node.nodeType === 1) {
      var j = 0,
          t = node.childNodes.length;

      while (j < t && !result) {
        result = this.traverseDown(node.childNodes[j], callback, i + 1);
        j++;
      }
    }

    return result;
  };

  Module.traversePrevious = function traversePrevious(node, callback, i) {
    if (i === void 0) {
      i = 0;
    }

    if (!node) {
      return;
    }

    var result = callback(node, i);

    if (result) {
      return result;
    }

    return this.traversePrevious(node.previousSibling, callback, i + 1);
  };

  Module.traverseNext = function traverseNext(node, callback, i) {
    if (i === void 0) {
      i = 0;
    }

    if (!node) {
      return;
    }

    var result = callback(node, i);

    if (result) {
      return result;
    }

    return this.traverseNext(node.nextSibling, callback, i + 1);
  };

  return Module;
}();
function getParsableContextByNode(node) {
  var context;
  var rxcompId = node.rxcompId;

  if (rxcompId) {
    var nodeContexts = NODES[rxcompId];

    if (nodeContexts) {
      context = nodeContexts.reduce(function (previous, current) {
        if (current.factory.prototype instanceof Component) {
          return current;
        } else if (current.factory.prototype instanceof Context) {
          return previous ? previous : current;
          /*
          } else if (current.factory.prototype instanceof Structure) {
              return previous ? previous : current;
          */
        } else {
          return previous;
        }
      }, undefined); // console.log(node.rxcompId, context);
    }
  }

  return context;
}
function getContextByNode(node) {
  var context = getParsableContextByNode(node);

  if (context && context.factory.prototype instanceof Structure) {
    context = undefined;
  }

  return context;
}
function getHost(instance, factory, node) {
  if (!node) {
    node = getContext(instance).node;
  }

  if (node.rxcompId) {
    var nodeContexts = NODES[node.rxcompId];

    if (nodeContexts) {
      // console.log(nodeContexts);
      for (var i = 0; i < nodeContexts.length; i++) {
        var context = nodeContexts[i];

        if (context.instance !== instance) {
          // console.log(context.instance, instance);
          if (context.instance instanceof factory) {
            return context.instance;
          }
        }
      }
    }
  }

  if (node.parentNode) {
    return getHost(instance, factory, node.parentNode);
  } else {
    return undefined;
  }
}var SrcDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(SrcDirective, _Directive);

  function SrcDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  _createClass(SrcDirective, [{
    key: "src",
    set: function set(src) {
      if (this.src_ !== src) {
        this.src_ = src;

        var _getContext = getContext(this),
            node = _getContext.node;

        src ? node.setAttribute('src', src) : node.removeAttribute('src');
      }
    },
    get: function get() {
      return this.src_;
    }
  }]);

  return SrcDirective;
}(Directive);
SrcDirective.meta = {
  selector: '[[src]]',
  inputs: ['src']
};var StyleDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(StyleDirective, _Directive);

  function StyleDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = StyleDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = getContext(this),
        node = _getContext.node;

    var style = this.style;
    var previousStyle = this.previousStyle;

    if (previousStyle) {
      for (var key in previousStyle) {
        if (!style || !style[key]) {
          var splitted = key.split('.');
          var propertyName = splitted.shift();
          node.style.removeProperty(propertyName);
        }
      }
    }

    if (style) {
      for (var _key in style) {
        if (!previousStyle || previousStyle[_key] !== style[_key]) {
          var _splitted = _key.split('.');

          var _propertyName = _splitted.shift();

          var value = style[_key] + (_splitted.length ? _splitted[0] : ''); // console.log(propertyName, value, style, key, style[key]);

          node.style.setProperty(_propertyName, value);
        }
      }
    }

    this.previousStyle = style; // console.log('StyleDirective.onChanges', style);
  };

  return StyleDirective;
}(Directive);
StyleDirective.meta = {
  selector: "[[style]]",
  inputs: ['style']
};var factories = [ClassDirective, EventDirective, ForStructure, HrefDirective, IfStructure, InnerHtmlDirective, JsonComponent, SrcDirective, StyleDirective];
var pipes = [JsonPipe];

var CoreModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(CoreModule, _Module);

  function CoreModule() {
    var _this;

    _this = _Module.call(this) || this; // console.log('CoreModule');

    errors$.pipe(operators.takeUntil(_this.unsubscribe$)).subscribe();
    return _this;
  }

  return CoreModule;
}(Module);
CoreModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};var Browser = /*#__PURE__*/function (_Platform) {
  _inheritsLoose(Browser, _Platform);

  function Browser() {
    return _Platform.apply(this, arguments) || this;
  }

  /**
   * @param moduleFactory
   * @description This method returns a Browser compiled module
   */
  Browser.bootstrap = function bootstrap(moduleFactory) {
    if (!isPlatformBrowser) {
      throw new ModuleError('missing platform browser, window not found');
    }

    if (!moduleFactory) {
      throw new ModuleError('missing moduleFactory');
    }

    if (!moduleFactory.meta) {
      throw new ModuleError('missing moduleFactory meta');
    }

    if (!moduleFactory.meta.bootstrap) {
      throw new ModuleError('missing bootstrap');
    }

    if (!moduleFactory.meta.bootstrap.meta) {
      throw new ModuleError('missing bootstrap meta');
    }

    if (!moduleFactory.meta.bootstrap.meta.selector) {
      throw new ModuleError('missing bootstrap meta selector');
    }

    var meta = this.resolveMeta(moduleFactory);
    var module = new moduleFactory();
    module.meta = meta;
    meta.imports.forEach(function (moduleFactory) {
      moduleFactory.prototype.constructor.call(module);
    });

    if (window.rxcomp_hydrate_) {
      var _meta$node$parentNode;

      var clonedNode = meta.node.cloneNode();
      clonedNode.innerHTML = meta.nodeInnerHTML = window.rxcomp_hydrate_.innerHTML;
      var instances = module.compile(clonedNode, window);
      module.instances = instances;
      var root = instances[0]; // if (root instanceof module.meta.bootstrap) {

      root.pushChanges();
      (_meta$node$parentNode = meta.node.parentNode) == null ? void 0 : _meta$node$parentNode.replaceChild(clonedNode, meta.node); // }
    } else {
      var _instances = module.compile(meta.node, window);

      module.instances = _instances;
      var _root = _instances[0]; // if (root instanceof module.meta.bootstrap) {

      _root.pushChanges(); // }

    }

    return module;
  };

  return Browser;
}(Platform);function getLocationComponents(href) {
  var protocol = '';
  var host = '';
  var hostname = '';
  var port = '';
  var pathname = '';
  var search = '';
  var hash = '';
  var regExp = /^((http\:|https\:)?\/\/)?((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])|locahost)?(\:([^\/]+))?(\.?\/[^\?]+)?(\?[^\#]+)?(\#.+)?$/g;
  var matches = href.matchAll(regExp);

  for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
    var match = _step.value;
    protocol = match[2] || '';
    host = hostname = match[3] || '';
    port = match[11] || '';
    pathname = match[12] || '';
    search = match[13] || '';
    hash = match[14] || '';
  }

  return {
    href: href,
    protocol: protocol,
    host: host,
    hostname: hostname,
    port: port,
    pathname: pathname,
    search: search,
    hash: hash
  };
}var TransferService = /*#__PURE__*/function () {
  function TransferService() {}

  TransferService.makeKey = function makeKey(base, params) {
    var paramsKey = params ? optionsToKey(params) : '';
    var key = "rxcomp-hydrate-" + base + "-" + paramsKey;
    key = key.replace(/(\s+)|(\W+)/g, function () {
      return (arguments.length <= 1 ? undefined : arguments[1]) ? '' : '_';
    }); // console.log('TransferService.makeKey', key, base, paramsKey);

    return key;
  };

  TransferService.has = function has(key) {
    var script = document.querySelector("#" + key);
    return script !== null;
  };

  TransferService.get = function get(key) {
    var node = document.querySelector("#" + key);

    if (node && node.firstChild) {
      var json = node.firstChild.nodeValue;
      return json ? Serializer.decode(json, [_decodeJson]) : undefined;
    } else {
      return undefined;
    }
  };

  TransferService.set = function set(key, value) {
    // console.log('TransferService.set', key, value);
    var json = Serializer.encode(value, [_encodeJson]);

    if (!json) {
      return;
    }

    var text = document.createTextNode(json);
    var node = document.querySelector("#" + key);

    if (!node) {
      node = document.createElement('script');
      node.setAttribute('id', key);
      node.setAttribute('type', 'text/template'); // console.log('node', node!!, 'document', document!!, 'head', document.head!!);

      node.append(text);
      document.head.append(node);
    } else {
      node.replaceChild(text, node.firstChild);
    }
  };

  TransferService.remove = function remove(key) {
    var node = document.querySelector("#" + key);

    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  };

  return TransferService;
}();
function optionsToKey(v, s) {
  if (s === void 0) {
    s = '';
  }

  if (typeof v === 'number') {
    s += '-' + v.toString();
  } else if (typeof v === 'string') {
    s += '-' + v.substr(0, 20);
  } else if (v && Array.isArray(v)) {
    s += '-' + v.map(function (v) {
      return optionsToKey(v);
    }).join('');
  } else if (v && typeof v === 'object') {
    s += '-' + Object.keys(v).map(function (k) {
      return k + optionsToKey(v[k]);
    }).join('-');
  }

  return s;
}exports.Browser=Browser;exports.ClassDirective=ClassDirective;exports.Component=Component;exports.Context=Context;exports.CoreModule=CoreModule;exports.DefaultErrorHandler=DefaultErrorHandler;exports.Directive=Directive;exports.ErrorInterceptorHandler=ErrorInterceptorHandler;exports.ErrorInterceptors=ErrorInterceptors;exports.EventDirective=EventDirective;exports.ExpressionError=ExpressionError;exports.Factory=Factory;exports.ForItem=ForItem;exports.ForStructure=ForStructure;exports.HrefDirective=HrefDirective;exports.IfStructure=IfStructure;exports.InnerHtmlDirective=InnerHtmlDirective;exports.JsonComponent=JsonComponent;exports.JsonPipe=JsonPipe;exports.Module=Module;exports.ModuleError=ModuleError;exports.PLATFORM_BROWSER=PLATFORM_BROWSER;exports.PLATFORM_JS_DOM=PLATFORM_JS_DOM;exports.PLATFORM_NODE=PLATFORM_NODE;exports.PLATFORM_WEB_WORKER=PLATFORM_WEB_WORKER;exports.Pipe=Pipe;exports.Platform=Platform;exports.Serializer=Serializer;exports.SrcDirective=SrcDirective;exports.Structure=Structure;exports.StyleDirective=StyleDirective;exports.TransferService=TransferService;exports.decodeBase64=_decodeBase;exports.decodeJson=_decodeJson;exports.encodeBase64=_encodeBase;exports.encodeJson=_encodeJson;exports.encodeJsonWithOptions=encodeJsonWithOptions;exports.errors$=errors$;exports.getContext=getContext;exports.getContextByNode=getContextByNode;exports.getHost=getHost;exports.getLocationComponents=getLocationComponents;exports.getParsableContextByNode=getParsableContextByNode;exports.isPlatformBrowser=isPlatformBrowser;exports.isPlatformServer=isPlatformServer;exports.isPlatformWorker=isPlatformWorker;exports.nextError$=nextError$;exports.optionsToKey=optionsToKey;Object.defineProperty(exports,'__esModule',{value:true});})));
/**
 * @license rxcomp-http v1.0.0-beta.14
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('rxcomp'),require('rxjs'),require('rxjs/operators')):typeof define==='function'&&define.amd?define(['exports','rxcomp','rxjs','rxjs/operators'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.rxcomp=g.rxcomp||{},g.rxcomp.http={}),g.rxcomp,g.rxjs,g.rxjs.operators));}(this,(function(exports, rxcomp, rxjs, operators){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}(function (HttpEventType) {
  HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
  HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
  HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
  HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
  HttpEventType[HttpEventType["Response"] = 4] = "Response";
  HttpEventType[HttpEventType["User"] = 5] = "User";
  HttpEventType[HttpEventType["ResponseError"] = 6] = "ResponseError";
})(exports.HttpEventType || (exports.HttpEventType = {}));var HttpHeaders = /*#__PURE__*/function () {
  function HttpHeaders(options) {
    var _this = this;

    this.headers_ = new Map();
    var headers = this.headers_;

    if (options instanceof HttpHeaders) {
      options.headers_.forEach(function (value, key) {
        headers.set(key, value);
      });
    } else if (typeof (options == null ? void 0 : options.forEach) === 'function') {
      options.forEach(function (value, key) {
        headers.set(key, value.split(', '));
      });
    } else if (typeof options === 'object') {
      Object.keys(options).forEach(function (key) {
        var values = options[key];

        if (typeof values === 'string') {
          values = [values];
        }

        if (headers.has(key)) {
          values.forEach(function (value) {
            return _this.append(key, value);
          });
        } else {
          headers.set(key, values);
        }
      });
    } else if (typeof options === 'string') {
      options.split('\n').forEach(function (line) {
        var index = line.indexOf(':');

        if (index > 0) {
          var key = line.slice(0, index);
          var value = line.slice(index + 1).trim();

          if (headers.has(key)) {
            _this.append(key, value);
          } else {
            headers.set(key, [value]);
          }
        }
      });
    }

    if (!headers.has('Accept')) {
      headers.set('Accept', ['application/json', 'text/plain', '*/*']);
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', ['application/json']);
    }
  }

  var _proto = HttpHeaders.prototype;

  _proto.has = function has(key) {
    return this.headers_.has(key);
  };

  _proto.get = function get(key) {
    var values = this.headers_.get(key);
    return values ? values.join(', ') : null;
  };

  _proto.set = function set(key, value) {
    var clone = this.clone_();
    clone.headers_.set(key, value.split(', '));
    return clone;
  };

  _proto.append = function append(key, value) {
    var clone = this.clone_();
    var values = clone.headers_.has(key) ? clone.headers_.get(key) || [] : [];
    values.push(value);
    clone.headers_.set(key, values);
    return clone;
  };

  _proto.delete = function _delete(key) {
    var clone = this.clone_();
    clone.headers_.delete(key);
    return clone;
  };

  _proto.forEach = function forEach(callback, thisArg) {
    var _this2 = this;

    this.headers_.forEach(function (v, k) {
      callback(v.join(', '), k, _this2);
    });
  };

  _proto.serialize = function serialize() {
    var headers = [];
    this.forEach(function (value, key) {
      headers.push([key, value]);
    });
    return headers;
  };

  _proto.toObject = function toObject() {
    var headers = {};
    this.forEach(function (value, key) {
      headers[key] = value;
    });
    return headers;
  };

  _proto.clone_ = function clone_() {
    var clone = new HttpHeaders();
    this.headers_.forEach(function (value, key) {
      clone.headers_.set(key, value);
    });
    return clone;
  };

  return HttpHeaders;
}();var HttpErrorResponse = /*#__PURE__*/function (_Error) {
  _inheritsLoose(HttpErrorResponse, _Error);

  function HttpErrorResponse(options) {
    var _this;

    _this = _Error.call(this, (options == null ? void 0 : options.message) || 'Unknown Error') || this;
    _this.status = 0;
    _this.statusText = 'Unknown Error';
    _this.ok = false;
    _this.type = exports.HttpEventType.ResponseError;
    _this.message = 'Unknown Error';
    _this.name = 'HttpErrorResponse';

    if (options) {
      _this.headers = new HttpHeaders(options.headers);
      _this.status = options.status || _this.status;
      _this.statusText = options.statusText || _this.statusText;
      _this.url = options.url || _this.url;
      _this.error = options.error || _this.error;
      _this.name = options.name || _this.name;
      _this.request = options.request || null;
    }

    return _this;
  }

  var _proto = HttpErrorResponse.prototype;

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      error: this.error,
      message: this.message,
      name: this.name,
      request: this.request
    }, options || {});
    var clone = new HttpErrorResponse(options);
    return clone;
  };

  return HttpErrorResponse;
}( /*#__PURE__*/_wrapNativeSuper(Error));var HttpHeaderResponse = /*#__PURE__*/function () {
  function HttpHeaderResponse(options) {
    this.status = 200;
    this.statusText = 'OK';
    this.type = exports.HttpEventType.ResponseHeader;

    if (options) {
      this.headers = new HttpHeaders(options.headers);
      this.status = options.status || this.status;
      this.statusText = options.statusText || this.statusText;
      this.url = options.url || this.url;
    }

    this.ok = this.status >= 200 && this.status < 300;
  }

  var _proto = HttpHeaderResponse.prototype;

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      ok: this.ok,
      type: this.type
    }, options || {});
    var clone = new HttpHeaderResponse(options);
    return clone;
  };

  return HttpHeaderResponse;
}();
var HttpResponse = /*#__PURE__*/function () {
  function HttpResponse(options) {
    this.status = 200;
    this.statusText = 'OK';
    this.type = exports.HttpEventType.Response;
    this.body = null;

    if (options) {
      this.headers = new HttpHeaders(options.headers);
      this.status = options.status || this.status;
      this.statusText = options.statusText || this.statusText;
      this.url = options.url || this.url;
      this.body = options.body || this.body;
    }

    this.ok = this.status >= 200 && this.status < 300;
  }

  var _proto2 = HttpResponse.prototype;

  _proto2.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      status: this.status,
      statusText: this.statusText,
      url: this.url,
      ok: this.ok,
      type: this.type,
      body: this.body
    }, options || {});
    var clone = new HttpResponse(options);
    return clone;
  };

  _proto2.toObject = function toObject() {
    var response = {};
    response.url = this.url;
    response.headers = this.headers.toObject();
    response.status = this.status;
    response.statusText = this.statusText;
    response.ok = this.ok;
    response.type = this.type;
    response.body = this.body;
    return response;
  };

  return HttpResponse;
}();
var HttpResponseBase = function HttpResponseBase(options, defaultStatus, defaultStatusText) {
  if (defaultStatus === void 0) {
    defaultStatus = 200;
  }

  if (defaultStatusText === void 0) {
    defaultStatusText = 'OK';
  }

  this.status = 200;
  this.statusText = 'OK';
  this.headers = options.headers || new HttpHeaders();
  this.status = options.status !== undefined ? options.status : defaultStatus;
  this.statusText = options.statusText || defaultStatusText;
  this.url = options.url || undefined;
  this.ok = this.status >= 200 && this.status < 300;
};
/*
// !!!
export default class HttpResponse {
    data?: any;
    url: string = '';
    status: number = 0;
    statusText: string = '';
    ok: boolean = false;
    redirected: boolean = false;
    get static() {
        return this.url!.indexOf('.json') === this.url!.length - 5;
    }
    constructor(response: Response) {
        this.data = null;
        if (response) {
            this.url = response.url;
            this.status = response.status;
            this.statusText = response.statusText;
            this.ok = response.ok;
            this.redirected = response.redirected;
        }
    }
}
*/var HttpFetchHandler = /*#__PURE__*/function () {
  function HttpFetchHandler() {
    this.response_ = null;
    /*
    onProgress(value: Uint8Array, done: boolean, request, reader, progress) {
        console.log("value:", value);
        if (value || done) {
            console.log("upload complete, request.bodyUsed:", request.bodyUsed);
            progress.value = progress.max;
            return reader.closed.then(() => fileUpload);
        };
        console.log("upload progress:", value);
        if (progress.value < file.size) {
            progress.value += 1;
        }
        return reader.read().then(({ value, done }) => this.onProgress(value, done, request, reader, progress));
    }
    */

    /*
    getProgress_(request) {
        const uploadProgress = new ReadableStream({
            start(controller) {
                console.log("starting upload, request.bodyUsed:", request.bodyUsed);
                controller.enqueue(request.bodyUsed);
            },
            pull(controller) {
                if (request.bodyUsed) {
                    controller.close();
                }
                controller.enqueue(request.bodyUsed);
                console.log("pull, request.bodyUsed:", request.bodyUsed);
            },
            cancel(reason) {
                console.log(reason);
            }
        });
        const [fileUpload, reader] = [
            upload(request).catch(e => {
                reader.cancel();
                console.log(e);
                throw e
            }), uploadProgress.getReader()
        ];
    }
    */
  }

  var _proto = HttpFetchHandler.prototype;

  _proto.handle = function handle(request) {
    var _this = this;

    if (!request.method) {
      throw new Error("missing method");
    }

    var requestInfo = request.urlWithParams;
    var requestInit = request.toInitRequest(); // console.log('fetchRequest', fetchRequest);
    // fetchRequest.headers.forEach((value, key) => console.log('HttpFetchHandler.handle', key, value));
    // request = request.clone({ headers: fetchRequest.headers });
    // console.log('HttpFetchHandler.handle', 'requestInfo', requestInfo, 'requestInit', requestInit);
    // hydrate

    var stateKey = rxcomp.TransferService.makeKey(request.transferKey); // console.log('HttpFetchHandler.get', 'stateKey', stateKey, 'isPlatformBrowser', isPlatformBrowser, 'hydrate', request.hydrate);

    var response;

    if (rxcomp.isPlatformBrowser && request.hydrate && rxcomp.TransferService.has(stateKey)) {
      var transfer = rxcomp.TransferService.get(stateKey);

      if (transfer) {
        response = new HttpResponse(transfer);
      } // console.log('HttpFetchHandler', cached);


      rxcomp.TransferService.remove(stateKey);
    } // hydrate


    if (response) {
      return rxjs.of(response);
    } else {
      return rxjs.from(fetch(requestInfo, requestInit) // fetch(fetchRequest)
      .then(function (response) {
        return _this.getProgress(response, request);
      }).then(function (response) {
        return _this.getResponse(response, request);
      })).pipe( // hydrate
      operators.tap(function (response) {
        // console.log('HttpFetchHandler.set', 'isPlatformServer', isPlatformServer, 'hydrate', request.hydrate, response);
        if (rxcomp.isPlatformServer && request.hydrate) {
          rxcomp.TransferService.set(stateKey, response.toObject());
        }
      }), // hydrate
      operators.catchError(function (error) {
        var errorResponse = {
          error: error
        };

        if (_this.response_) {
          errorResponse.headers = _this.response_.headers;
          errorResponse.status = _this.response_.status;
          errorResponse.statusText = _this.response_.statusText;
          errorResponse.url = _this.response_.url;
          errorResponse.request = request;
        }

        var httpErrorResponse = new HttpErrorResponse(errorResponse); // console.log('httpErrorResponse', httpErrorResponse);

        rxcomp.nextError$.next(httpErrorResponse);
        return rxjs.of(_this.response_); // return throwError(httpErrorResponse);
      }), operators.finalize(function () {
        _this.response_ = null;
      }));
    }
  };

  _proto.getProgress = function getProgress(response, request) {
    var _this2 = this;

    // console.log('HttpFetchHandler.setProgress', request.reportProgress, response.body);
    var clonedBody = response.clone().body;

    if (rxcomp.isPlatformBrowser && request.reportProgress && clonedBody) {
      var reader = clonedBody.getReader();
      var contentLength = response.headers && response.headers.has('Content-Length') ? +(response.headers.get('Content-Length') || 0) : 0;
      return new Promise(function (resolve, reject) {
        /*
        let receivedLength = 0; // received that many bytes at the moment
        const chunks: Uint8Array[] = []; // array of received binary chunks (comprises the body)
        const getChunk = () => {
            return reader.read().then(({ done, value }) => {
                if (!done) {
                    if (value) {
                        chunks.push(value);
                        receivedLength += value.length || 0;
                        console.log(`HttpFetchHandler.setProgress ${(receivedLength / contentLength * 100).toFixed(2)}% ${receivedLength} of ${contentLength}`);
                    }
                    getChunk();
                } else {
                    reader.cancel();
                    resolve(response);
                    if (false) {
                        // Step 4: concatenate chunks into single Uint8Array
                        const chunksAll = new Uint8Array(receivedLength); // (4.1)
                        let position = 0;
                        for (let chunk of chunks) {
                            chunksAll.set(chunk, position); // (4.2)
                            position += chunk.length;
                        }
                        // Step 5: decode into a string
                        const result = new TextDecoder("utf-8").decode(chunksAll);
                        // We're done!
                        const data = JSON.parse(result);
                        console.log('HttpFetchHandler.setProgress data', data);
                        resolve(response);
                    }
                }
            }).catch(error => {
                reader.cancel();
                reject(error);
            });
        };
        getChunk();
        */
        var progress = {
          progress: 0,
          percent: 0,
          current: 0,
          total: 0
        };

        var onProgress = function onProgress(value, done) {
          var receivedLength = progress.current;

          if (!done) {
            if (value) {
              receivedLength += value.length || 0;
              progress.total = contentLength;
              progress.current = receivedLength;
              progress.progress = receivedLength / contentLength;
              progress.percent = progress.progress * 100;
            } // console.log('progress', progress);


            return reader.read().then(function (_ref) {
              var value = _ref.value,
                  done = _ref.done;
              return onProgress(value, done);
            });
          } else {
            progress.total = contentLength;
            progress.current = contentLength;
            progress.progress = 1;
            progress.percent = 100; // console.log('progress', progress);

            return reader.closed.then(function () {
              return response.clone();
            });
          }
        };

        reader.read().then(function (_ref2) {
          var value = _ref2.value,
              done = _ref2.done;
          return onProgress(value, done);
        }).then(function (response) {
          _this2.response_ = new HttpResponse(response);

          if (typeof response[request.responseType] === 'function') {
            return response[request.responseType]().then(function (json) {
              _this2.response_ = new HttpResponse(Object.assign(_this2.response_, {
                body: json
              }));

              if (response.ok) {
                return resolve(_this2.response_);
              } else {
                return reject(_this2.response_);
              }
            });
          } else {
            return reject(_this2.response_);
          }
        }).catch(function (err) {
          return console.log("upload error:", err);
        });
      });
    } else {
      return Promise.resolve(response);
    }
  };

  _proto.getResponse = function getResponse(response, request) {
    this.response_ = new HttpResponse(response);

    if (rxcomp.isPlatformBrowser && request.reportProgress && response.body) {
      return Promise.resolve(this.response_);
    } else {
      return this.getResponseType(response, request);
    }
  };

  _proto.getResponseType = function getResponseType(response, request) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      _this3.response_ = new HttpResponse(response);

      if (typeof response[request.responseType] === 'function') {
        return response[request.responseType]().then(function (json) {
          _this3.response_ = new HttpResponse(Object.assign(_this3.response_, {
            body: json
          }));

          if (response.ok) {
            return resolve(_this3.response_);
          } else {
            return reject(_this3.response_);
          }
        });
      } else {
        return reject(_this3.response_);
      }
    });
  };

  _proto.getReadableStream = function getReadableStream(response, request) {
    var reader = response.body.getReader();
    var readableStream = new ReadableStream({
      start: function start(controller) {
        // console.log("starting upload, request.bodyUsed:", request.bodyUsed);
        // controller.enqueue(request.bodyUsed);
        // The following function handles each data chunk
        var push = function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(function (_ref3) {
            var done = _ref3.done,
                value = _ref3.value;

            // Is there no more data to read?
            if (done) {
              // Tell the browser that we have finished sending data
              controller.close();
              return;
            } // Get the data and send it to the browser via the controller


            controller.enqueue(value);
            push();
          });
        };

        push();
      }
    });
    return readableStream;
  };

  return HttpFetchHandler;
}();var XSSI_PREFIX = /^\)\]\}',?\n/;
var HttpXhrHandler = /*#__PURE__*/function () {
  function HttpXhrHandler() {}

  var _proto = HttpXhrHandler.prototype;

  _proto.handle = function handle(request) {
    if (!request.method) {
      throw new Error("missing method");
    }

    if (request.method === 'JSONP') {
      throw new Error("Attempted to construct Jsonp request without JsonpClientModule installed.");
    }

    console.log('HttpXhrHandler.request', request);
    return new rxjs.Observable(function (observer) {
      var xhr = new XMLHttpRequest();
      var requestInfo = request.urlWithParams;
      var requestInit = request.toInitRequest();

      if (!requestInit.method) {
        throw new Error("missing method");
      } // hydrate


      var stateKey = rxcomp.TransferService.makeKey(request.transferKey);

      if (rxcomp.isPlatformBrowser && request.hydrate && rxcomp.TransferService.has(stateKey)) {
        var cached = rxcomp.TransferService.get(stateKey); // !!! <T>

        rxcomp.TransferService.remove(stateKey);
        observer.next(cached);
        observer.complete();
        return; // hydrate
      } else {
        xhr.open(requestInit.method, requestInfo);

        if (request.withCredentials) {
          xhr.withCredentials = true;
        }

        var headers = request.headers;

        if (!headers.has('Accept')) {
          headers.set('Accept', 'application/json, text/plain, */*');
        }

        if (!headers.has('Content-Type')) {
          var detectedType = request.detectContentTypeHeader();

          if (detectedType !== null) {
            headers.set('Content-Type', detectedType);
          }
        }

        console.log('HttpXhrHandler.contentType', headers.get('Content-Type'));
        headers.forEach(function (value, name) {
          return xhr.setRequestHeader(name, value);
        });

        if (request.responseType) {
          xhr.responseType = request.responseType !== 'json' ? request.responseType : 'text';
        }

        var body = request.serializeBody();
        var headerResponse = null;

        var partialFromXhr_ = function partialFromXhr_() {
          if (headerResponse !== null) {
            return headerResponse;
          }

          var status = xhr.status === 1223 ? 204 : xhr.status;
          var statusText = xhr.statusText || 'OK';
          var headers = new HttpHeaders(xhr.getAllResponseHeaders());
          var url = getResponseUrl_(xhr) || request.url;
          headerResponse = new HttpHeaderResponse({
            headers: headers,
            status: status,
            statusText: statusText,
            url: url
          });
          return headerResponse;
        };

        var onLoad = function onLoad() {
          var _partialFromXhr_ = partialFromXhr_(),
              headers = _partialFromXhr_.headers,
              status = _partialFromXhr_.status,
              statusText = _partialFromXhr_.statusText,
              url = _partialFromXhr_.url;

          var body = null;

          if (status !== 204) {
            body = typeof xhr.response === 'undefined' ? xhr.responseText : xhr.response;
          }

          if (status === 0) {
            status = !!body ? 200 : 0;
          }

          var ok = status >= 200 && status < 300;

          if (request.responseType === 'json' && typeof body === 'string') {
            var originalBody = body;
            body = body.replace(XSSI_PREFIX, '');

            try {
              body = body !== '' ? JSON.parse(body) : null;
            } catch (error) {
              body = originalBody;

              if (ok) {
                ok = false;
                body = {
                  error: error,
                  text: body
                };
              }
            }
          }

          if (ok) {
            var response = new HttpResponse({
              body: body,
              headers: headers,
              status: status,
              statusText: statusText,
              url: url
            }); // hydrate

            if (rxcomp.isPlatformServer && request.hydrate) {
              rxcomp.TransferService.set(stateKey, response);
            } // hydrate


            observer.next(response);
            observer.complete();
          } else {
            var options = {
              error: new Error(statusText),
              headers: headers,
              status: status,
              statusText: statusText,
              url: url,
              request: request
            };
            var httpErrorResponse = new HttpErrorResponse(options); // console.log('httpErrorResponse', httpErrorResponse);

            rxcomp.nextError$.next(httpErrorResponse); // return of(null);

            observer.error(httpErrorResponse);
          }
        };

        var onError = function onError(error) {
          var _partialFromXhr_2 = partialFromXhr_(),
              url = _partialFromXhr_2.url;

          var statusText = xhr.statusText || 'Unknown Error';
          var headers = new HttpHeaders(xhr.getAllResponseHeaders());
          var options = {
            error: new Error(statusText),
            headers: headers,
            status: xhr.status || 0,
            statusText: statusText,
            url: url,
            request: request
          };
          var httpErrorResponse = new HttpErrorResponse(options); // console.log('httpErrorResponse', httpErrorResponse);

          rxcomp.nextError$.next(httpErrorResponse); // return of(null);

          observer.error(httpErrorResponse);
        };

        var sentHeaders = false;

        var onDownProgress = function onDownProgress(event) {
          if (!sentHeaders) {
            observer.next(partialFromXhr_());
            sentHeaders = true;
          }

          var progressEvent = {
            type: exports.HttpEventType.DownloadProgress,
            loaded: event.loaded
          };

          if (event.lengthComputable) {
            progressEvent.total = event.total;
          }

          if (request.responseType === 'text' && !!xhr.responseText) {
            progressEvent.partialText = xhr.responseText;
          }

          console.log(progressEvent);
          observer.next(progressEvent);
        };

        var onUpProgress = function onUpProgress(event) {
          var progress = {
            type: exports.HttpEventType.UploadProgress,
            loaded: event.loaded
          };

          if (event.lengthComputable) {
            progress.total = event.total;
          }

          observer.next(progress);
        };

        xhr.addEventListener('load', onLoad);
        xhr.addEventListener('error', onError);

        if (request.reportProgress) {
          xhr.addEventListener('progress', onDownProgress);

          if (body !== null && xhr.upload) {
            xhr.upload.addEventListener('progress', onUpProgress);
          }
        }

        xhr.send(body);
        observer.next({
          type: exports.HttpEventType.Sent
        });
        return function () {
          xhr.removeEventListener('error', onError);
          xhr.removeEventListener('load', onLoad);

          if (request.reportProgress) {
            xhr.removeEventListener('progress', onDownProgress);

            if (body !== null && xhr.upload) {
              xhr.upload.removeEventListener('progress', onUpProgress);
            }
          }

          if (xhr.readyState !== xhr.DONE) {
            xhr.abort();
          }
        };
      }
    });
  };

  return HttpXhrHandler;
}();

function getResponseUrl_(xhr) {
  if ('responseURL' in xhr && xhr.responseURL) {
    return xhr.responseURL;
  }

  if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
    return xhr.getResponseHeader('X-Request-URL');
  }

  return null;
}var HttpInterceptorHandler = /*#__PURE__*/function () {
  function HttpInterceptorHandler(next, interceptor) {
    this.next = next;
    this.interceptor = interceptor;
  }

  var _proto = HttpInterceptorHandler.prototype;

  _proto.handle = function handle(req) {
    return this.interceptor.intercept(req, this.next);
  };

  return HttpInterceptorHandler;
}();
var HttpInterceptors = [];
var NoopInterceptor = /*#__PURE__*/function () {
  function NoopInterceptor() {}

  var _proto2 = NoopInterceptor.prototype;

  _proto2.intercept = function intercept(req, next) {
    return next.handle(req);
  };

  return NoopInterceptor;
}();
var fetchHandler = new HttpFetchHandler();
var xhrHandler = new HttpXhrHandler();
var HttpInterceptingHandler = /*#__PURE__*/function () {
  function HttpInterceptingHandler() {
    this.chain = null;
  }

  var _proto3 = HttpInterceptingHandler.prototype;

  _proto3.handle = function handle(req) {
    if (this.chain === null) {
      var interceptors = HttpInterceptors;
      this.chain = interceptors.reduceRight(function (next, interceptor) {
        return new HttpInterceptorHandler(next, interceptor);
      }, fetchHandler);
    }

    return this.chain.handle(req);
  };

  return HttpInterceptingHandler;
}();
function interceptingHandler(handler, interceptors) {
  if (interceptors === void 0) {
    interceptors = [];
  }

  if (!interceptors) {
    return handler;
  }

  return interceptors.reduceRight(function (next, interceptor) {
    return new HttpInterceptorHandler(next, interceptor);
  }, handler);
}
function jsonpCallbackContext() {
  if (typeof window === 'object') {
    return window;
  }

  return {};
}var factories = [];
var pipes = [];
/**
 *  HttpModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *    HttpModule
 *  ],
 *  declarations: [
 *   ErrorsComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */

var HttpModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(HttpModule, _Module);

  function HttpModule() {
    return _Module.apply(this, arguments) || this;
  }

  HttpModule.useInterceptors = function useInterceptors(interceptorFactories) {
    if (interceptorFactories == null ? void 0 : interceptorFactories.length) {
      var interceptors = interceptorFactories == null ? void 0 : interceptorFactories.map(function (x) {
        return new x();
      });
      HttpInterceptors.push.apply(HttpInterceptors, interceptors);
    }

    return this;
  };

  return HttpModule;
}(rxcomp.Module);
HttpModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};var HttpHandler = function HttpHandler() {};var HttpUrlEncodingCodec = /*#__PURE__*/function () {
  function HttpUrlEncodingCodec() {}

  var _proto = HttpUrlEncodingCodec.prototype;

  _proto.encodeKey = function encodeKey(key) {
    return encodeParam_(key);
  };

  _proto.encodeValue = function encodeValue(value) {
    return encodeParam_(value);
  };

  _proto.decodeKey = function decodeKey(key) {
    return decodeURIComponent(key);
  };

  _proto.decodeValue = function decodeValue(value) {
    return decodeURIComponent(value);
  };

  return HttpUrlEncodingCodec;
}();
var HttpParams = /*#__PURE__*/function () {
  function HttpParams(options, encoder) {
    if (encoder === void 0) {
      encoder = new HttpUrlEncodingCodec();
    }

    this.params_ = new Map();
    this.encoder = encoder;
    var params = this.params_;

    if (options instanceof HttpParams) {
      options.params_.forEach(function (value, key) {
        params.set(key, value);
      });
    } else if (typeof options === 'object') {
      Object.keys(options).forEach(function (key) {
        var value = options[key];
        params.set(key, Array.isArray(value) ? value : [value]);
      });
    } else if (typeof options === 'string') {
      parseRawParams_(params, options, this.encoder);
    } // ?updates=null&cloneFrom=null&encoder=%5Bobject%20Object%5D&params_=%5Bobject%20Map%5D

  }

  var _proto2 = HttpParams.prototype;

  _proto2.keys = function keys() {
    return Array.from(this.params_.keys());
  };

  _proto2.has = function has(key) {
    return this.params_.has(key);
  };

  _proto2.get = function get(key) {
    var value = this.params_.get(key);
    return value ? value[0] : null;
  };

  _proto2.getAll = function getAll(key) {
    return this.params_.get(key) || null;
  };

  _proto2.set = function set(key, value) {
    var clone = this.clone_();
    clone.params_.set(key, [value]);
    return clone;
  };

  _proto2.append = function append(key, value) {
    var clone = this.clone_();

    if (clone.has(key)) {
      var values = clone.params_.get(key) || [];
      values.push(value);
      clone.params_.set(key, values);
    } else {
      clone.params_.set(key, [value]);
    }

    return clone;
  };

  _proto2.delete = function _delete(key) {
    var clone = this.clone_();
    clone.params_.delete(key);
    return clone;
  };

  _proto2.toString = function toString() {
    var _this = this;

    return this.keys().map(function (key) {
      var values = _this.params_.get(key);

      return _this.encoder.encodeKey(key) + (values ? '=' + values.map(function (x) {
        return _this.encoder.encodeValue(x);
      }).join('&') : '');
    }).filter(function (keyValue) {
      return keyValue !== '';
    }).join('&');
  };

  _proto2.toObject = function toObject() {
    var _this2 = this;

    var params = {};
    this.keys().map(function (key) {
      var values = _this2.params_.get(key);

      if (values) {
        params[key] = values;
      } // return this.encoder.encodeKey(key) + (values ? '=' + values.map(x => this.encoder.encodeValue(x)).join('&') : '');

    });
    return params;
  };

  _proto2.clone_ = function clone_() {
    var clone = new HttpParams(undefined, this.encoder);
    this.params_.forEach(function (value, key) {
      clone.params_.set(key, value);
    });
    return clone;
  };

  return HttpParams;
}();

function parseRawParams_(params, queryString, encoder) {
  if (queryString.length > 0) {
    var keyValueParams = queryString.split('&');
    keyValueParams.forEach(function (keyValue) {
      var index = keyValue.indexOf('=');

      var _ref = index == -1 ? [encoder.decodeKey(keyValue), ''] : [encoder.decodeKey(keyValue.slice(0, index)), encoder.decodeValue(keyValue.slice(index + 1))],
          key = _ref[0],
          value = _ref[1];

      var values = params.get(key) || [];
      values.push(value);
      params.set(key, values);
    });
  }

  return params;
}

function encodeParam_(v) {
  return encodeURIComponent(v).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/gi, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%2B/gi, '+').replace(/%3D/gi, '=').replace(/%3F/gi, '?').replace(/%2F/gi, '/');
}var HttpRequest = /*#__PURE__*/function () {
  function HttpRequest(method, url, third, fourth) {
    this.url = url;
    this.reportProgress = false;
    this.withCredentials = false;
    this.hydrate = true;
    this.observe = 'body';
    this.responseType = 'json'; // !!! remove, rethink

    var isStaticFile = /\.(json|xml|txt)(\?.*)?$/.test(url);
    this.method = isStaticFile ? 'GET' : method.toUpperCase();
    var options;

    if (methodHasBody_(this.method) || !!fourth) {
      this.body = third !== undefined ? third : null;
      options = fourth;
    } else {
      options = third;
    }

    if (options) {
      this.reportProgress = !!options.reportProgress;
      this.withCredentials = !!options.withCredentials;
      this.observe = options.observe || this.observe;

      if (options.responseType) {
        this.responseType = options.responseType;
      }

      if (options.headers) {
        this.headers = new HttpHeaders(options.headers);
      }

      if (options.params) {
        this.params = new HttpParams(options.params);
      }
    }

    if (!this.headers) {
      this.headers = new HttpHeaders();
    }

    if (!this.params) {
      this.params = new HttpParams();
    }

    var params = this.params.toString();
    var index = url.indexOf('?');
    var sep = index === -1 ? '?' : index < url.length - 1 ? '&' : '';
    this.urlWithParams = url + (params.length ? sep + params : params);
  }

  var _proto = HttpRequest.prototype;

  _proto.serializeBody = function serializeBody() {
    if (this.body === null) {
      return null;
    }

    if (isArrayBuffer_(this.body) || isBlob_(this.body) || isFormData_(this.body) || typeof this.body === 'string') {
      return this.body;
    }

    if (this.body instanceof HttpParams) {
      return this.body.toString();
    }

    if (typeof this.body === 'object' || typeof this.body === 'boolean' || Array.isArray(this.body)) {
      return JSON.stringify(this.body);
    }

    return this.body.toString();
  };

  _proto.detectContentTypeHeader = function detectContentTypeHeader() {
    if (this.body === null) {
      return null;
    }

    if (isFormData_(this.body)) {
      return null;
    }

    if (isBlob_(this.body)) {
      return this.body.type || null;
    }

    if (isArrayBuffer_(this.body)) {
      return null;
    }

    if (typeof this.body === 'string') {
      return 'text/plain';
    }

    if (this.body instanceof HttpParams) {
      return 'application/x-www-form-urlencoded;charset=UTF-8';
    }

    if (typeof this.body === 'object' || typeof this.body === 'number' || Array.isArray(this.body)) {
      return 'application/json';
    }

    return null;
  };

  _proto.toInitRequest = function toInitRequest() {
    return {
      method: this.method,
      headers: this.headers.serialize(),
      body: this.serializeBody(),
      mode: 'same-origin',
      credentials: 'same-origin',
      cache: 'default',
      redirect: 'error'
    };
  };

  _proto.toFetchRequest__ = function toFetchRequest__() {
    return new Request(this.urlWithParams, this.toInitRequest());
    /*
    Request.cache Read only
    Contains the cache mode of the request (e.g., default, reload, no-cache).
    Request.context Read only
    Contains the context of the request (e.g., audio, image, iframe, etc.)
    Request.credentials Read only
    Contains the credentials of the request (e.g., omit, same-origin, include). The default is same-origin.
    Request.destination Read only
    Returns a string from the RequestDestination enum describing the request's destination. This is a string indicating the type of content being requested.
    Request.headers Read only
    Contains the associated Headers object of the request.
    Request.integrity Read only
    Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
    Request.method Read only
    Contains the request's method (GET, POST, etc.)
    Request.mode Read only
    Contains the mode of the request (e.g., cors, no-cors, same-origin, navigate.)
    Request.redirect Read only
    Contains the mode for how redirects are handled. It may be one of follow, error, or manual.
    Request.referrer Read only
    Contains the referrer of the request (e.g., client).
    Request.referrerPolicy Read only
    Contains the referrer policy of the request (e.g., no-referrer).
    Request.url Read only
    Contains the URL of the request.
    Request implements Body, so it also inherits the following properties:
    body Read only
    A simple getter used to expose a ReadableStream of the body contents.
    bodyUsed Read only
    Stores a Boolean that declares whether the body has been used in a response yet.
    */
  };

  _proto.clone = function clone(options) {
    options = Object.assign({
      headers: this.headers,
      reportProgress: this.reportProgress,
      params: this.params,
      responseType: this.responseType,
      withCredentials: this.withCredentials,
      observe: this.observe,
      body: this.body,
      url: this.url,
      method: this.method
    }, options || {});
    var clone = new HttpRequest(this.method, this.url, this.body, options);
    return clone;
  };

  _proto.toObject = function toObject() {
    var request = {};
    request.url = this.url;
    request.method = this.method;
    request.headers = this.headers.toObject();
    request.params = this.params.toObject();
    request.body = this.body;
    request.reportProgress = this.reportProgress;
    request.responseType = this.responseType;
    request.withCredentials = this.withCredentials;
    request.observe = this.observe;
    return request;
  };

  _createClass(HttpRequest, [{
    key: "transferKey",
    get: function get() {
      var pathname = rxcomp.getLocationComponents(this.url).pathname;
      var paramsKey = rxcomp.optionsToKey(this.params.toObject());
      var bodyKey = rxcomp.optionsToKey(this.body);
      var key = this.method + "-" + pathname + "-" + paramsKey + "-" + bodyKey;
      key = key.replace(/(\s+)|(\W+)/g, function () {
        return (arguments.length <= 1 ? undefined : arguments[1]) ? '' : '_';
      }); // console.log('transferKey', key);

      return key;
    }
  }]);

  return HttpRequest;
}();

function methodHasBody_(method) {
  switch (method) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return false;

    default:
      return true;
  }
}

function isArrayBuffer_(value) {
  return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}

function isBlob_(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isFormData_(value) {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}var HttpService = /*#__PURE__*/function () {
  function HttpService() {}

  HttpService.incrementPendingRequest = function incrementPendingRequest() {
    HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() + 1);
  };

  HttpService.decrementPendingRequest = function decrementPendingRequest() {
    HttpService.pendingRequests$.next(HttpService.pendingRequests$.getValue() - 1);
  };

  HttpService.request$ = function request$(first, url, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var request;

    if (first instanceof HttpRequest) {
      request = first;
    } else {
      var headers = undefined;

      if (options.headers instanceof HttpHeaders) {
        headers = options.headers;
      } else {
        headers = new HttpHeaders(options.headers);
      }

      var params = undefined;

      if (options.params) {
        params = new HttpParams(options.params);
      }

      request = new HttpRequest(first, url, options.body !== undefined ? options.body : null, {
        headers: headers,
        params: params,
        reportProgress: options.reportProgress,
        responseType: options.responseType || 'json',
        withCredentials: options.withCredentials
      });
    } // console.log('HttpService.request$', request);


    HttpService.incrementPendingRequest();
    var events$ = rxjs.of(request).pipe(operators.concatMap(function (request) {
      return _this.handler.handle(request);
    }), // tap((response: HttpEvent<any>) => console.log('HttpService.response', response)),
    operators.finalize(function () {
      return HttpService.decrementPendingRequest();
    }));

    if (first instanceof HttpRequest || options.observe === 'events') {
      return events$.pipe(operators.catchError(function (error) {
        console.log('error', error);
        return rxjs.throwError(_this.getError(error, null, request));
      }));
    }

    var response$ = events$.pipe(operators.filter(function (event) {
      return event instanceof HttpResponse;
    }));
    var response_;
    var observe$ = response$.pipe(operators.map(function (response) {
      response_ = response;

      switch (options.observe || 'body') {
        case 'body':
          switch (request.responseType) {
            case 'arraybuffer':
              if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
                throw new Error('Response is not an ArrayBuffer.');
              }

              return response.body;

            case 'blob':
              if (response.body !== null && !(response.body instanceof Blob)) {
                throw new Error('Response is not a Blob.');
              }

              return response.body;

            case 'text':
              if (response.body !== null && typeof response.body !== 'string') {
                throw new Error('Response is not a string.');
              }

              return response.body;

            case 'json':
            default:
              return response.body;
          }

        case 'response':
          return response;

        default:
          throw new Error("Unreachable: unhandled observe type " + options.observe + "}");
      }
    }), operators.catchError(function (error) {
      console.log('error', error);
      return rxjs.throwError(_this.getError(error, response_, request));
    }));
    return observe$;
    /*
    switch (options.observe || 'body') {
        case 'body':
            switch (request.responseType) {
                case 'arraybuffer':
                    return response$.pipe(map((response: HttpResponse<T>) => {
                        if (response.body !== null && !(response.body instanceof ArrayBuffer)) {
                            throw new Error('Response is not an ArrayBuffer.');
                        }
                        return response.body;
                    }));
                case 'blob':
                    return response$.pipe(map((response: HttpResponse<T>) => {
                        if (response.body !== null && !(response.body instanceof Blob)) {
                            throw new Error('Response is not a Blob.');
                        }
                        return response.body;
                    }));
                case 'text':
                    return response$.pipe(map((response: HttpResponse<T>) => {
                        if (response.body !== null && typeof response.body !== 'string') {
                            throw new Error('Response is not a string.');
                        }
                        return response.body;
                    }));
                case 'json':
                default:
                    return response$.pipe(map((response: HttpResponse<T>) => response.body));
            }
        case 'response':
            return response$;
        default:
            throw new Error(`Unreachable: unhandled observe type ${options.observe}}`);
    }
    */
  };

  HttpService.delete$ = function delete$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('DELETE', url, options);
  };

  HttpService.get$ = function get$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('GET', url, options);
  };

  HttpService.head$ = function head$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('HEAD', url, options);
  };

  HttpService.jsonp$ = function jsonp$(url, callbackParam) {
    return this.request$('JSONP', url, {
      params: new HttpParams().append(callbackParam, 'JSONP_CALLBACK'),
      observe: 'body',
      responseType: 'json'
    });
  };

  HttpService.options$ = function options$(url, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('OPTIONS', url, options);
  };

  HttpService.patch$ = function patch$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('PATCH', url, optionsWithBody_(options, body));
  };

  HttpService.post$ = function post$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('POST', url, optionsWithBody_(options, body));
  };

  HttpService.put$ = function put$(url, body, options) {
    if (options === void 0) {
      options = {};
    }

    return this.request$('PUT', url, optionsWithBody_(options, body));
  };

  HttpService.getError = function getError(error, response, request) {
    if (!error.status) {
      error.statusCode = (response == null ? void 0 : response.status) || 0;
    }

    if (!error.statusMessage) {
      error.statusMessage = (response == null ? void 0 : response.statusText) || 'Unknown Error';
    }

    var options = {
      error: error,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      request: request
    };

    if (response) {
      options.headers = response.headers;
      options.status = options.status || response.status;
      options.statusText = options.statusText || response.statusText;
      options.url = response.url;
    }

    return new HttpErrorResponse(options);
  };

  return HttpService;
}();
HttpService.pendingRequests$ = new rxjs.BehaviorSubject(0); // static handler: HttpHandler = new HttpFetchHandler();

HttpService.handler = new HttpInterceptingHandler();

function optionsWithBody_(options, body) {
  return Object.assign({}, options, {
    body: body
  });
}exports.HttpErrorResponse=HttpErrorResponse;exports.HttpFetchHandler=HttpFetchHandler;exports.HttpHandler=HttpHandler;exports.HttpHeaderResponse=HttpHeaderResponse;exports.HttpHeaders=HttpHeaders;exports.HttpInterceptingHandler=HttpInterceptingHandler;exports.HttpInterceptorHandler=HttpInterceptorHandler;exports.HttpInterceptors=HttpInterceptors;exports.HttpModule=HttpModule;exports.HttpParams=HttpParams;exports.HttpRequest=HttpRequest;exports.HttpResponse=HttpResponse;exports.HttpResponseBase=HttpResponseBase;exports.HttpService=HttpService;exports.HttpUrlEncodingCodec=HttpUrlEncodingCodec;exports.HttpXhrHandler=HttpXhrHandler;exports.NoopInterceptor=NoopInterceptor;exports.fetchHandler=fetchHandler;exports.interceptingHandler=interceptingHandler;exports.jsonpCallbackContext=jsonpCallbackContext;exports.xhrHandler=xhrHandler;Object.defineProperty(exports,'__esModule',{value:true});})));
/**
 * @license rxcomp-router v1.0.0-beta.14
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('rxcomp'),require('rxjs'),require('rxjs/operators')):typeof define==='function'&&define.amd?define(['exports','rxcomp','rxjs','rxjs/operators'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.rxcomp=g.rxcomp||{},g.rxcomp.router={}),g.rxcomp,g.rxjs,g.rxjs.operators));}(this,(function(exports, rxcomp, rxjs, operators){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}var View = /*#__PURE__*/function (_Component) {
  _inheritsLoose(View, _Component);

  function View() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = View.prototype;

  _proto.onEnter = function onEnter(node) {
    return rxjs.of(true);
  };

  _proto.onExit = function onExit(node) {
    return rxjs.of(true);
  };

  return View;
}(rxcomp.Component);var LocationStrategy = /*#__PURE__*/function () {
  function LocationStrategy() {}

  var _proto = LocationStrategy.prototype;

  _proto.serializeLink = function serializeLink(routerLink) {
    var _this = this;

    var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
      return typeof x === 'string' ? x : _this.encodeParams(x);
    }).join('/');
    return this.serializeUrl(url);
  };

  _proto.serializeUrl = function serializeUrl(url) {
    return url;
  };

  _proto.serialize = function serialize(routePath) {
    return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
  };

  _proto.resolve = function resolve(url, target) {
    if (target === void 0) {
      target = {};
    }

    var prefix = '';
    var path = '';
    var query = '';
    var search = '';
    var hash = '';
    var segments;
    var params;
    var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
    var matches = url.matchAll(regExp);

    for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
      var match = _step.value;
      var g1 = match[1];
      var g2 = match[2];
      var g3 = match[3];

      if (g1) {
        path = g1;
      }

      if (g2) {
        query = g2;
      }

      if (g3) {
        hash = g3;
      }
    }

    prefix = prefix;
    path = path;
    query = query;
    hash = hash.substring(1, hash.length);
    search = query.substring(1, query.length);
    segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    params = {};
    target.prefix = prefix;
    target.path = path;
    target.query = query;
    target.hash = hash;
    target.search = search;
    target.segments = segments;
    target.params = params; // console.log('resolvePath_', url, prefix, path, query, search, hash, segments, params);

    return target;
  };

  _proto.resolveParams = function resolveParams(path, routeSegments) {
    var _this2 = this;

    var segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    var params = {};
    routeSegments.forEach(function (segment, index) {
      // console.log('segment.params', segment.params);
      var keys = Object.keys(segment.params);

      if (keys.length) {
        params[keys[0]] = _this2.decodeParams(segments[index]);
      }
    });
    return params;
  };

  _proto.encodeParams = function encodeParams(value) {
    var encoded = null;

    try {
      if (typeof value === 'object') {
        encoded = ';' + rxcomp.Serializer.encode(value, [rxcomp.encodeJson, rxcomp.encodeBase64]);
      } else if (typeof value === 'number') {
        encoded = value.toString();
      }
    } catch (error) {
      console.log('encodeParam__.error', error);
    }

    return encoded;
  };

  _proto.decodeParams = function decodeParams(value) {
    if (value === void 0) {
      value = null;
    }

    var decoded = value;

    if (value) {
      if (value.indexOf(';') === 0) {
        try {
          decoded = rxcomp.Serializer.decode(value.substring(1, value.length), [rxcomp.decodeBase64, rxcomp.decodeJson]);
        } catch (error) {
          decoded = value;
        }
      } else if (Number(value).toString() === value) {
        decoded = Number(value);
      }
    }

    return decoded;
  };

  _proto.encodeSegment = function encodeSegment(s) {
    return this.encodeString(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
  };

  _proto.decodeSegment = function decodeSegment(s) {
    return this.decodeString(s.replace(/%28/g, '(').replace(/%29/g, ')').replace(/\&/gi, '%26'));
  };

  _proto.encodeString = function encodeString(s) {
    return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
  };

  _proto.decodeString = function decodeString(s) {
    return decodeURIComponent(s.replace(/\@/g, '%40').replace(/\:/gi, '%3A').replace(/\$/g, '%24').replace(/\,/gi, '%2C'));
  };

  _proto.getPath = function getPath(url) {
    return url;
  };

  _proto.getUrl = function getUrl(url, params) {
    return "" + url + (params ? '?' + params.toString() : '');
  };

  _proto.setHistory = function setHistory(url, params, popped) {
    if (rxcomp.isPlatformBrowser && window.history && window.history.pushState) {
      var title = document.title;
      url = this.getUrl(url, params); // !!!
      // const state = params ? params.toString() : '';
      // console.log(state);

      if (popped) {
        window.history.replaceState(undefined, title, url);
      } else {
        window.history.pushState(undefined, title, url);
      }
    }
  };

  return LocationStrategy;
}();
var LocationStrategyPath = /*#__PURE__*/function (_LocationStrategy) {
  _inheritsLoose(LocationStrategyPath, _LocationStrategy);

  function LocationStrategyPath() {
    return _LocationStrategy.apply(this, arguments) || this;
  }

  var _proto2 = LocationStrategyPath.prototype;

  _proto2.serialize = function serialize(routePath) {
    return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
  };

  _proto2.resolve = function resolve(url, target) {
    if (target === void 0) {
      target = {};
    }

    var prefix = '';
    var path = '';
    var query = '';
    var search = '';
    var hash = '';
    var segments;
    var params;
    var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
    var matches = url.matchAll(regExp);

    for (var _iterator2 = _createForOfIteratorHelperLoose(matches), _step2; !(_step2 = _iterator2()).done;) {
      var match = _step2.value;
      var g1 = match[1];
      var g2 = match[2];
      var g3 = match[3];

      if (g1) {
        path = g1;
      }

      if (g2) {
        query = g2;
      }

      if (g3) {
        hash = g3;
      }
    }

    prefix = prefix;
    path = path;
    query = query;
    hash = hash.substring(1, hash.length);
    search = query.substring(1, query.length);
    segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    params = {};
    target.prefix = prefix;
    target.path = path;
    target.query = query;
    target.hash = hash;
    target.search = search;
    target.segments = segments;
    target.params = params; // console.log('resolvePath_', url, prefix, path, query, search, hash, segments, params);

    return target;
  };

  return LocationStrategyPath;
}(LocationStrategy);
var LocationStrategyHash = /*#__PURE__*/function (_LocationStrategy2) {
  _inheritsLoose(LocationStrategyHash, _LocationStrategy2);

  function LocationStrategyHash() {
    return _LocationStrategy2.apply(this, arguments) || this;
  }

  var _proto3 = LocationStrategyHash.prototype;

  _proto3.serializeLink = function serializeLink(routerLink) {
    var _this3 = this;

    var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
      return typeof x === 'string' ? x : _this3.encodeParams(x);
    }).join('/');
    return this.serializeUrl(url);
  };

  _proto3.serializeUrl = function serializeUrl(url) {
    var path = this.resolve(url, {});
    return this.serialize(path);
  };

  _proto3.serialize = function serialize(routePath) {
    return "" + routePath.prefix + routePath.search + routePath.hash + routePath.path;
  };

  _proto3.resolve = function resolve(url, target) {
    if (target === void 0) {
      target = {};
    }

    var prefix = '';
    var path = '';
    var query = '';
    var search = '';
    var hash = '#';
    var segments;
    var params;
    var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#.*)$/gm;
    var matches = url.matchAll(regExp);

    for (var _iterator3 = _createForOfIteratorHelperLoose(matches), _step3; !(_step3 = _iterator3()).done;) {
      var match = _step3.value;
      var g1 = match[1];
      var g2 = match[2];
      var g3 = match[3];

      if (g1) {
        prefix = g1;
      }

      if (g2) {
        query = g2;
      }

      if (g3) {
        path = g3;
      }
    }

    prefix = prefix;
    path = path.substring(1, path.length);
    hash = hash;
    search = query.substring(1, query.length);
    segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    params = {};
    target.prefix = prefix;
    target.path = path;
    target.query = query;
    target.hash = hash;
    target.search = search;
    target.segments = segments;
    target.params = params; // console.log('resolvePath_', url, prefix, path, query, search, hash, segments, params);

    return target;
  };

  _proto3.getPath = function getPath(url) {
    if (url.indexOf("/#") === -1) {
      return "/#" + url;
    } else {
      return url;
    }
  };

  _proto3.getUrl = function getUrl(url, params) {
    return "" + (params ? '?' + params.toString() : '') + this.getPath(url);
  };

  return LocationStrategyHash;
}(LocationStrategy);function mapCanDeactivate$_(activator) {
  return function canDeactivate$(component, currentRoute) {
    return makeObserver$_(function () {
      return activator.canDeactivate(component, currentRoute);
    });
  };
}
function mapCanLoad$_(activator) {
  return function canLoad$$(route, segments) {
    return makeObserver$_(function () {
      return activator.canLoad(route, segments);
    });
  };
}
function mapCanActivate$_(activator) {
  return function canActivate$(route) {
    return makeObserver$_(function () {
      return activator.canActivate(route);
    });
  };
}
function mapCanActivateChild$_(activator) {
  return function canActivateChild$(childRoute) {
    return makeObserver$_(function () {
      return activator.canActivateChild(childRoute);
    });
  };
}
function isPromise(object) {
  return object instanceof Promise || typeof object === 'object' && 'then' in object && typeof object['then'] === 'function';
}

function makeObserver$_(callback) {
  return rxjs.Observable.create(function (observer) {
    var subscription;

    try {
      var result = callback();

      if (rxjs.isObservable(result)) {
        subscription = result.subscribe(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (isPromise(result)) {
        result.then(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (typeof result === 'boolean' || Array.isArray(result)) {
        observer.next(result);
        observer.complete();
      } else {
        observer.error(new Error('invalid value'));
      }
    } catch (error) {
      observer.error(error);
    }

    return function () {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
}var RouteSegment = function RouteSegment(path, params) {
  if (params === void 0) {
    params = {};
  }

  this.path = path;
  this.params = params;
};
/*
export function encodeParams_(params: RouterKeyValue): string {
    // !!! array?
    return Object.keys(params).map(key => `;${encodeSegment_(key)}=${typeof params[key] === 'string' ? encodeSegment_(params[key] as string) : encodeParams_(params[key] as RouterKeyValue)}`).join('');
}
export function encodeSegment_(s: string): string {
    return encodeString_(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
export function encodeString_(s: string): string {
    return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}
export function decodeParams_(encodedParams: string): RouterKeyValue {
    const params: RouterKeyValue = {} as RouterKeyValue;
    const keyValues = encodedParams.split(';');
    keyValues.forEach((x: string) => {
        const kvs: string[] = x.split('=');
        if (kvs.length === 2) {
            params[kvs[0]] = kvs[1];
        }
    });
    return params;
}
export function decodeParams__<T>(encoded: string | null = null): T | null {
    let decoded = null;
    if (encoded) {
        try {
            const json = window.atob(encoded);
            decoded = JSON.parse(json) as T;
        } catch (error) {
            console.log('decodeParam_.error', error);
        }
    }
    return decoded;
}
export function encodeParams__(value: any): string | null {
    let encoded = null;
    try {
        const json = JSON.stringify(value);
        encoded = window.btoa(json);
    } catch (error) {
        console.log('encodeParam__.error', error);
    }
    return encoded;
}
export function resolveParams__(url: string, routeSegments: RouteSegment[]): RouterKeyValue {
    // console.log('resolveParams__.resolvedRoute.routeSegments', routeSegments);
    const path: string = url.split('?')[0];
    const query: string = url.substring(path.length, url.length);
    const search: string = query.split('#')[0];
    const hash: string = query.substring(search.length, query.length);
    const segments: string[] = path.split('/').filter(x => x !== '');
    const params: RouterKeyValue = {};
    routeSegments.forEach((segment: RouteSegment, index: number) => {
        // console.log('segment.params', segment.params);
        const keys: string[] = Object.keys(segment.params);
        if (keys.length) {
            params[keys[0]] = decodeParams_(segments[index]);
        }
    });
    return params;
}
*/var Route = function Route(options) {
  var _this = this;

  this.pathMatch = 'prefix';
  this.relative = true;
  this.canDeactivate = [];
  this.canLoad = [];
  this.canActivate = [];
  this.canActivateChild = [];

  if (options) {
    Object.assign(this, options);
    this.canDeactivate = options.canDeactivate ? options.canDeactivate.map(function (x) {
      return mapCanDeactivate$_(x);
    }) : [];
    this.canLoad = options.canLoad ? options.canLoad.map(function (x) {
      return mapCanLoad$_(x);
    }) : [];
    this.canActivate = options.canActivate ? options.canActivate.map(function (x) {
      return mapCanActivate$_(x);
    }) : [];
    this.canActivateChild = options.canActivateChild ? options.canActivateChild.map(function (x) {
      return mapCanActivateChild$_(x);
    }) : [];
  }

  if (this.children) {
    this.children = this.children.map(function (iRoute) {
      var route = new Route(iRoute);
      route.parent = _this;
      return route;
    });
  }

  var segments = [];

  if (this.path === '**') {
    segments.push(new RouteSegment(this.path));
    this.matcher = new RegExp('^.*$');
  } else {
    var matchers = ["^(../|./|//|/)?"];
    var regExp = /(^\.\.\/|\.\/|\/\/|\/)|([^:|\/]+)\/?|\:([^\/]+)\/?/g;
    var matches = this.path.matchAll(regExp);

    for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
      var match = _step.value;
      var g1 = match[1];
      var g2 = match[2];
      var g3 = match[3];

      if (g1) {
        this.relative = !(g1 === '//' || g1 === '/');
      } else if (g2) {
        matchers.push(g2);
        segments.push(new RouteSegment(g2));
      } else if (g3) {
        matchers.push('(\/[^\/]+)');
        var param = {};
        param[g3] = null;
        segments.push(new RouteSegment('', param));
      }
    }

    if (this.pathMatch === 'full') {
      matchers.push('$');
    }

    var regexp = matchers.join('');
    this.matcher = new RegExp(regexp);
  }

  this.segments = segments;
};var RoutePath = /*#__PURE__*/function () {
  function RoutePath(url, routeSegments, snapshot, locationStrategy) {
    if (url === void 0) {
      url = '';
    }

    if (routeSegments === void 0) {
      routeSegments = [];
    }

    this.prefix = '';
    this.path = '';
    this.query = '';
    this.search = '';
    this.hash = '';
    this.locationStrategy = locationStrategy || new LocationStrategy();
    this.url = url;
    this.routeSegments = routeSegments;
    this.route = snapshot;
  }

  _createClass(RoutePath, [{
    key: "url",
    get: function get() {
      return this.url_;
    },
    set: function set(url) {
      // console.log(this.url_, url);
      if (this.url_ !== url) {
        this.locationStrategy.resolve(url, this); // resolvePath_(url, this, this.locationStrategy);

        this.url_ = this.locationStrategy.serialize(this); // serializeUrl_(this, this.locationStrategy);
        // this.url_ = url; // !!! serialize url;
        // console.log('url_', this.url_);
      }
    }
  }, {
    key: "routeSegments",
    get: function get() {
      return this.routeSegments_;
    },
    set: function set(routeSegments) {
      if (this.routeSegments_ !== routeSegments) {
        this.routeSegments_ = routeSegments; // !!! const path: string = this.locationStrategy === RouteLocationStrategy.Hash ? this.hash : this.path;
        // this.params = resolveParams_(this.path, routeSegments);

        this.params = this.locationStrategy.resolveParams(this.path, routeSegments);
      }
    }
  }, {
    key: "remainUrl",
    get: function get() {
      return this.query + this.hash;
    }
  }]);

  return RoutePath;
}();
/*
export function encodeParams_(params: RouterKeyValue): string {
    // !!! array?
    return Object.keys(params).map(key => `;${encodeSegment_(key)}=${typeof params[key] === 'string' ? encodeSegment_(params[key] as string) : encodeParams_(params[key] as RouterKeyValue)}`).join('');
}
export function decodeParams_(encodedParams: string): RouterKeyValue {
    const params: RouterKeyValue = {} as RouterKeyValue;
    const keyValues = encodedParams.split(';');
    keyValues.forEach((x: string) => {
        const kvs: string[] = x.split('=');
        if (kvs.length === 2) {
            params[kvs[0]] = kvs[1];
        }
    });
    return params;
}
export function resolvePath___(url: string, routeSegments: RouteSegment[]): { path: string, search: string, hash: string, segments: any[] } {
    // console.log('resolvePath_.resolvedRoute.routeSegments', routeSegments);
    const path: string = url.split('?')[0];
    const query: string = url.substring(path.length, url.length);
    const search: string = query.split('#')[0];
    const hash: string = query.substring(search.length, query.length);
    const segments: string[] = path.split('/').filter(x => x !== '');
    const params: RouterKeyValue = {};
    routeSegments.forEach((segment: RouteSegment, index: number) => {
        // console.log('segment.params', segment.params);
        const keys: string[] = Object.keys(segment.params);
        if (keys.length) {
            params[keys[0]] = decodeParams_(segments[index]);
        }
    });
    return { path, search, hash, segments };
}
*/var RouteSnapshot = /*#__PURE__*/function () {
  function RouteSnapshot(options) {
    this.pathMatch = 'prefix';
    this.relative = true;
    this.data$ = new rxjs.ReplaySubject(1);
    this.params$ = new rxjs.ReplaySubject(1);
    this.queryParams$ = new rxjs.ReplaySubject(1);
    this.canDeactivate = [];
    this.canLoad = [];
    this.canActivate = [];
    this.canActivateChild = [];

    if (options) {
      Object.assign(this, options);
    }

    this.data$.next(this.data);
    this.params$.next(this.params);
    this.queryParams$.next(this.queryParams);
  }

  var _proto = RouteSnapshot.prototype;

  _proto.next = function next(snapshot) {
    this.childRoute = snapshot.childRoute;

    if (snapshot.childRoute) {
      snapshot.childRoute.parent = this;
    }

    var data = this.data = Object.assign({}, snapshot.data);
    this.data$.next(data);
    var params = this.params = Object.assign({}, snapshot.params);
    this.params$.next(params);
    var queryParams = this.queryParams = Object.assign({}, snapshot.queryParams);
    this.queryParams$.next(queryParams);
  };

  return RouteSnapshot;
}();var RouterEvent = function RouterEvent(options) {
  if (options) {
    Object.assign(this, options);
  }

  if (this.routerLink) {
    this.url = Array.isArray(this.routerLink) ? this.routerLink.join('') : this.routerLink;
  }
}; // An event triggered when navigation starts.

var NavigationStart = /*#__PURE__*/function (_RouterEvent) {
  _inheritsLoose(NavigationStart, _RouterEvent);

  function NavigationStart() {
    return _RouterEvent.apply(this, arguments) || this;
  }

  return NavigationStart;
}(RouterEvent); // An event triggered when the Router parses the URL and the routes are recognized.

var RoutesRecognized = /*#__PURE__*/function (_RouterEvent2) {
  _inheritsLoose(RoutesRecognized, _RouterEvent2);

  function RoutesRecognized() {
    return _RouterEvent2.apply(this, arguments) || this;
  }

  return RoutesRecognized;
}(RouterEvent); // An event triggered at the start of the Guard phase of routing.

var GuardsCheckStart = /*#__PURE__*/function (_RouterEvent3) {
  _inheritsLoose(GuardsCheckStart, _RouterEvent3);

  function GuardsCheckStart() {
    return _RouterEvent3.apply(this, arguments) || this;
  }

  return GuardsCheckStart;
}(RouterEvent); // An event triggered at the start of the child-activation part of the Resolve phase of routing.

var ChildActivationStart = /*#__PURE__*/function (_RouterEvent4) {
  _inheritsLoose(ChildActivationStart, _RouterEvent4);

  function ChildActivationStart() {
    return _RouterEvent4.apply(this, arguments) || this;
  }

  return ChildActivationStart;
}(RouterEvent); // An event triggered at the start of the activation part of the Resolve phase of routing.

var ActivationStart = /*#__PURE__*/function (_RouterEvent5) {
  _inheritsLoose(ActivationStart, _RouterEvent5);

  function ActivationStart() {
    return _RouterEvent5.apply(this, arguments) || this;
  }

  return ActivationStart;
}(RouterEvent); // An event triggered at the end of the Guard phase of routing.

var GuardsCheckEnd = /*#__PURE__*/function (_RouterEvent6) {
  _inheritsLoose(GuardsCheckEnd, _RouterEvent6);

  function GuardsCheckEnd() {
    return _RouterEvent6.apply(this, arguments) || this;
  }

  return GuardsCheckEnd;
}(RouterEvent); // An event triggered at the the start of the Resolve phase of routing.

var ResolveStart = /*#__PURE__*/function (_RouterEvent7) {
  _inheritsLoose(ResolveStart, _RouterEvent7);

  function ResolveStart() {
    return _RouterEvent7.apply(this, arguments) || this;
  }

  return ResolveStart;
}(RouterEvent); // An event triggered at the end of the Resolve phase of routing.

var ResolveEnd = /*#__PURE__*/function (_RouterEvent8) {
  _inheritsLoose(ResolveEnd, _RouterEvent8);

  function ResolveEnd() {
    return _RouterEvent8.apply(this, arguments) || this;
  }

  return ResolveEnd;
}(RouterEvent); // An event triggered at the end of the activation part of the Resolve phase of routing.

var ActivationEnd = /*#__PURE__*/function (_RouterEvent9) {
  _inheritsLoose(ActivationEnd, _RouterEvent9);

  function ActivationEnd() {
    return _RouterEvent9.apply(this, arguments) || this;
  }

  return ActivationEnd;
}(RouterEvent); // An event triggered at the end of the child-activation part of the Resolve phase of routing.

var ChildActivationEnd = /*#__PURE__*/function (_RouterEvent10) {
  _inheritsLoose(ChildActivationEnd, _RouterEvent10);

  function ChildActivationEnd() {
    return _RouterEvent10.apply(this, arguments) || this;
  }

  return ChildActivationEnd;
}(RouterEvent); // An event triggered before the Router lazy loads a route configuration.

var RouteConfigLoadStart = /*#__PURE__*/function (_RouterEvent11) {
  _inheritsLoose(RouteConfigLoadStart, _RouterEvent11);

  function RouteConfigLoadStart() {
    return _RouterEvent11.apply(this, arguments) || this;
  }

  return RouteConfigLoadStart;
}(RouterEvent); // An event triggered after a route has been lazy loaded.

var RouteConfigLoadEnd = /*#__PURE__*/function (_RouterEvent12) {
  _inheritsLoose(RouteConfigLoadEnd, _RouterEvent12);

  function RouteConfigLoadEnd() {
    return _RouterEvent12.apply(this, arguments) || this;
  }

  return RouteConfigLoadEnd;
}(RouterEvent); // An event triggered when navigation ends successfully.

var NavigationEnd = /*#__PURE__*/function (_RouterEvent13) {
  _inheritsLoose(NavigationEnd, _RouterEvent13);

  function NavigationEnd() {
    return _RouterEvent13.apply(this, arguments) || this;
  }

  return NavigationEnd;
}(RouterEvent); // An event triggered when navigation is canceled. This is due to a Route Guard returning false during navigation.

var NavigationCancel = /*#__PURE__*/function (_RouterEvent14) {
  _inheritsLoose(NavigationCancel, _RouterEvent14);

  function NavigationCancel() {
    return _RouterEvent14.apply(this, arguments) || this;
  }

  return NavigationCancel;
}(RouterEvent); // An event triggered when navigation fails due to an unexpected error.

var NavigationError = /*#__PURE__*/function (_RouterEvent15) {
  _inheritsLoose(NavigationError, _RouterEvent15);

  function NavigationError() {
    return _RouterEvent15.apply(this, arguments) || this;
  }

  return NavigationError;
}(RouterEvent);
/*
NavigationStart {id: 1, url: '/test-a', navigationTrigger: 'imperative', restoredState: null, constructor: Object}
RoutesRecognized {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
GuardsCheckStart {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
ChildActivationStart {snapshot: ActivatedRouteSnapshot, constructor: Object}
ActivationStart {snapshot: ActivatedRouteSnapshot, constructor: Object}
GuardsCheckEnd {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, shouldActivate: true…}
ResolveStart {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
ResolveEnd {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
ActivationEnd {snapshot: ActivatedRouteSnapshot, constructor: Object}
ChildActivationEnd {snapshot: ActivatedRouteSnapshot, constructor: Object}
NavigationEnd {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', constructor: Object}
Scroll {routerEvent: NavigationEnd, position: null, anchor: null, constructor: Object}
*/var RouterService = /*#__PURE__*/function () {
  function RouterService() {}

  RouterService.setRoutes = function setRoutes(routes) {
    this.routes = routes.map(function (x) {
      return new Route(x);
    });
    this.observe$ = makeObserve$_(this.routes, this.route$, this.events$, this.locationStrategy);
    return this;
  };

  RouterService.setRouterLink = function setRouterLink(routerLink, extras) {

    // ['/hero', hero.id];
    this.events$.next(new NavigationStart({
      routerLink: routerLink,
      trigger: 'imperative'
    }));
  };

  RouterService.navigate = function navigate(routerLink, extras) {

    // navigate(['items'], { relativeTo: this.route });
    // navigate(['/heroes', { id: heroId }]);
    this.events$.next(new NavigationStart({
      routerLink: routerLink,
      trigger: 'imperative'
    }));
  };

  RouterService.findRoute = function findRoute(routerLink) {
    var initialUrl = this.locationStrategy.serializeLink(routerLink);
    return this.findRouteByUrl(initialUrl);
  };

  RouterService.findRouteByUrl = function findRouteByUrl(initialUrl) {
    var routes = getFlatRoutes_(this.routes);
    var resolvedRoute = routes.find(function (route) {
      return initialUrl.match(route.matcher);
    }) || null;
    var urlAfterRedirects = initialUrl;

    if (resolvedRoute && resolvedRoute.redirectTo) {
      urlAfterRedirects = resolvedRoute.redirectTo;
      resolvedRoute = this.findRouteByUrl(urlAfterRedirects);
    }

    return resolvedRoute;
  };

  RouterService.getPath = function getPath(routerLink) {
    var _this = this;

    if (routerLink === void 0) {
      routerLink = [];
    }

    var lastPath = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
      return typeof x === 'string' ? x : _this.locationStrategy.encodeParams(x);
    }).join('/');
    var segments = [];
    var routes = [];
    var route = this.findRouteByUrl(lastPath);

    if (route) {
      var r = route == null ? void 0 : route.parent;

      while (r) {
        segments.unshift.apply(segments, r.segments);
        routes.unshift(r instanceof RouteSnapshot ? r : r.snapshot || r);
        r = r.parent;
      }

      segments.push.apply(segments, (route == null ? void 0 : route.segments) || []);
      routes.push({
        path: lastPath
      });
    }

    var initialUrl = routes.map(function (r) {
      return r instanceof RouteSnapshot ? r.extractedUrl : r.path;
    }).join('/');
    initialUrl = this.locationStrategy.getPath(initialUrl); // console.log('RouterService.getPath', initialUrl);

    var routePath = new RoutePath(initialUrl, segments, route || undefined, this.locationStrategy);
    return routePath;
  };

  RouterService.useLocationStrategy = function useLocationStrategy(locationStrategyType) {
    this.locationStrategy_ = new locationStrategyType();
  };

  _createClass(RouterService, null, [{
    key: "flatRoutes",
    get: function get() {
      return getFlatRoutes_(this.routes);
    }
  }, {
    key: "locationStrategy",
    get: function get() {
      if (this.locationStrategy_) {
        return this.locationStrategy_;
      } else {
        return this.locationStrategy_ = new LocationStrategyPath();
      }
    }
  }]);

  return RouterService;
}();
RouterService.routes = [];
RouterService.route$ = new rxjs.ReplaySubject(1);
RouterService.events$ = new rxjs.ReplaySubject(1);
/*
function setHistory_(locationStrategy: ILocationStrategy, url: string, params?: URLSearchParams, popped?: boolean): void {
    if (isPlatformBrowser && window.history && window.history.pushState) {
        const title = document.title;
        url = locationStrategy.getUrl(url, params);
        // !!!
        // const state = params ? params.toString() : '';
        // console.log(state);
        if (popped) {
            window.history.replaceState(undefined, title, url);
        } else {
            window.history.pushState(undefined, title, url);
        }
    }
}
*/

function getFlatRoutes_(routes) {
  var reduceRoutes = function reduceRoutes(routes) {
    return routes.reduce(function (p, c) {
      p.push(c);
      p.push.apply(p, reduceRoutes(c.children || []));
      return p;
    }, []);
  };

  return reduceRoutes(routes);
}

function getFlatSnapshots_(currentSnapshot) {
  var snapshots = [currentSnapshot];
  var childRoute = currentSnapshot.childRoute;

  while (childRoute) {
    snapshots.push(childRoute);
    childRoute = childRoute.childRoute;
  }

  return snapshots;
}

function clearRoutes_(routes, currentSnapshot) {
  var snapshots = getFlatSnapshots_(currentSnapshot);
  var flatRoutes = getFlatRoutes_(routes);
  flatRoutes.forEach(function (route) {
    if (route.snapshot && snapshots.indexOf(route.snapshot) === -1) {
      route.snapshot = undefined;
    }
  });
}

function resolveRoutes_(routes, childRoutes, initialUrl) {
  var resolvedRoute;

  for (var _iterator = _createForOfIteratorHelperLoose(childRoutes), _step; !(_step = _iterator()).done;) {
    var route = _step.value;
    resolvedRoute = resolveRoute_(routes, route, initialUrl);

    if (resolvedRoute) {
      return resolvedRoute;
    }
  }

  return resolvedRoute; // return childRoutes.reduce<RouteSnapshot | undefined>((p, route) => p || resolveRoute_(routes, route, initialUrl), undefined);
}

function resolveRoute_(routes, route, initialUrl) {
  var _route$children;

  // console.log('resolveRoute_', initialUrl);
  var urlAfterRedirects;
  var extractedUrl = '';
  var remainUrl = initialUrl;
  var match = initialUrl.match(route.matcher); // console.log(route.matcher, match?.length, initialUrl, '=>', route.path);

  if (!match) {
    return undefined;
  }

  if (route.redirectTo) {
    // console.log('match', initialUrl, '=>', route.redirectTo, match);
    return resolveRoutes_(routes, routes, route.redirectTo);
  }
  /* else {
    // console.log('match', initialUrl, match);
  }*/


  extractedUrl = match[0];
  remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
  var routePath = new RoutePath(extractedUrl, route.segments, undefined, RouterService.locationStrategy);
  var params = routePath.params;
  var snapshot = new RouteSnapshot(_objectSpread2(_objectSpread2({}, route), {}, {
    initialUrl: initialUrl,
    urlAfterRedirects: urlAfterRedirects,
    extractedUrl: extractedUrl,
    remainUrl: remainUrl,
    params: params
  }));
  route.snapshot = snapshot;

  if (((_route$children = route.children) == null ? void 0 : _route$children.length) && remainUrl.length) {
    var childRoute = resolveRoutes_(routes, route.children, remainUrl);
    snapshot.childRoute = childRoute;

    if (childRoute) {
      childRoute.parent = snapshot;
    }
  } // console.log('RouteSnapshot', snapshot.path, snapshot.extractedUrl, snapshot.remainUrl);


  return snapshot;
}

function makeActivatorResponse$_(event, activators) {
  // console.log('makeActivatorResponse$_', event);
  return rxjs.combineLatest.apply(void 0, activators).pipe(operators.map(function (values) {
    var canActivate = values.reduce(function (p, c) {
      return p === true ? c === true ? true : c : p;
    }, true);

    if (canActivate === true) {
      return event;
    } else {
      var cancelEvent = _objectSpread2(_objectSpread2({}, event), {}, {
        reason: 'An activation guard has dismissed navigation to the route.'
      });

      if (canActivate !== false) {
        cancelEvent.redirectTo = canActivate;
      }

      return new NavigationCancel(cancelEvent);
    }
  }));
}

function makeCanDeactivateResponse$_(events$, event, currentRoute) {
  // console.log('makeCanDeactivateResponse$_', event);
  if (event.route.canDeactivate && event.route.canDeactivate.length && (currentRoute == null ? void 0 : currentRoute.instance)) {
    var route = event.route;
    return makeActivatorResponse$_(event, route.canDeactivate.map(function (x) {
      return x(currentRoute.instance, currentRoute);
    }));
  } else {
    return rxjs.of(event);
  }
}

function makeCanLoadResponse$_(events$, event) {
  // console.log('makeCanLoadResponse$_', event);
  if (event.route.canLoad && event.route.canLoad.length) {
    var route = event.route;
    return makeActivatorResponse$_(event, route.canLoad.map(function (x) {
      return x(route, route.segments);
    }));
  } else {
    return rxjs.of(event);
  }
}

function makeCanActivateChildResponse$_(events$, event) {
  // console.log('makeCanActivateChildResponse$_', event, event.route.childRoute);
  var reduceChildRouteActivators_ = function reduceChildRouteActivators_(route, activators) {
    // console.log('reduceChildRouteActivators_', route.canActivateChild, route.childRoute);
    while (route != null && route.canActivateChild && route.canActivateChild.length && route.childRoute) {
      var routeActivators = route.canActivateChild.map(function (x) {
        return x(route.childRoute);
      });
      Array.prototype.push.apply(activators, routeActivators);
      route = route.childRoute;
    }

    return activators;
  };

  var activators = reduceChildRouteActivators_(event.route, []); // console.log('makeCanActivateChildResponse$_', activators);

  if (activators.length) {
    return makeActivatorResponse$_(event, activators);
  } else {
    return rxjs.of(event);
  }
}

function makeCanActivateResponse$_(events$, event) {
  // console.log('makeCanActivateResponse$_', event);
  if (event.route.canActivate && event.route.canActivate.length) {
    var route = event.route;
    return makeActivatorResponse$_(event, route.canActivate.map(function (x) {
      return x(route);
    }));
  } else {
    return rxjs.of(event);
  }
}

function makeObserve$_(routes, route$, events$, locationStrategy) {
  var currentRoute;
  var stateEvents$ = rxjs.merge(rxjs.fromEvent(window, 'popstate')).pipe(
  /*
  tap((event: PopStateEvent) => {
      // console.log('location', document.location.pathname, 'state', event.state);
  }),
  */
  operators.map(function (event) {
    return new NavigationStart({
      routerLink: document.location.pathname,
      trigger: 'popstate'
    });
  }), operators.shareReplay(1));
  return rxjs.merge(stateEvents$, events$).pipe(operators.switchMap(function (event) {
    if (event instanceof GuardsCheckStart) {
      return makeCanDeactivateResponse$_(events$, event, currentRoute).pipe(operators.switchMap(function (nextEvent) {
        if (nextEvent instanceof NavigationCancel) {
          return rxjs.of(nextEvent);
        } else {
          return makeCanLoadResponse$_(events$, event).pipe(operators.switchMap(function (nextEvent) {
            if (nextEvent instanceof NavigationCancel) {
              return rxjs.of(nextEvent);
            } else {
              return makeCanActivateChildResponse$_(events$, event);
            }
          }));
        }
      }));
    } else if (event instanceof ChildActivationStart) {
      return makeCanActivateResponse$_(events$, event);
    } else {
      return rxjs.of(event);
    }
  }), operators.tap(function (event) {
    if (event instanceof NavigationStart) {
      var _currentRoute$childre;

      // console.log('NavigationStart', event.routerLink);
      var routerLink = event.routerLink; // console.log('routerLink', routerLink);

      var snapshot;
      var initialUrl;
      var routePath = RouterService.getPath(routerLink); // console.log(routePath, routePath.url);

      initialUrl = routePath.url; // console.log('initialUrl', initialUrl);

      var isRelative = initialUrl.indexOf('/') !== 0;

      if (isRelative && currentRoute && ((_currentRoute$childre = currentRoute.children) == null ? void 0 : _currentRoute$childre.length)) {
        snapshot = resolveRoutes_(routes, currentRoute.children, initialUrl);

        if (snapshot) {
          currentRoute.childRoute = snapshot;
          snapshot.parent = currentRoute;
          snapshot = currentRoute;
        } // console.log('relative', currentRoute, snapshot, initialUrl);

      } else {
        snapshot = resolveRoutes_(routes, routes, initialUrl); // console.log('absolute');
      }

      if (snapshot) {
        // console.log(routes);
        currentRoute = snapshot;
        events$.next(new RoutesRecognized(_objectSpread2(_objectSpread2({}, event), {}, {
          route: snapshot
        })));
      } else {
        events$.next(new NavigationError(_objectSpread2(_objectSpread2({}, event), {}, {
          error: new Error('unknown route')
        })));
      }
    } else if (event instanceof RoutesRecognized) {
      // console.log('RoutesRecognized', event);
      events$.next(new GuardsCheckStart(_objectSpread2({}, event)));
    } else if (event instanceof GuardsCheckStart) {
      // console.log('GuardsCheckStart', event);
      events$.next(new ChildActivationStart(_objectSpread2({}, event)));
    } else if (event instanceof ChildActivationStart) {
      // console.log('ChildActivationStart', event);
      events$.next(new ActivationStart(_objectSpread2({}, event)));
    } else if (event instanceof ActivationStart) {
      // console.log('ActivationStart', event);
      events$.next(new GuardsCheckEnd(_objectSpread2({}, event)));
    } else if (event instanceof GuardsCheckEnd) {
      // console.log('GuardsCheckEnd', event);
      events$.next(new ResolveStart(_objectSpread2({}, event)));
    } else if (event instanceof ResolveStart) {
      // console.log('ResolveStart', event);
      events$.next(new ResolveEnd(_objectSpread2({}, event)));
    } else if (event instanceof ResolveEnd) {
      // console.log('ResolveEnd', event);
      events$.next(new ActivationEnd(_objectSpread2({}, event)));
    } else if (event instanceof ActivationEnd) {
      // console.log('ActivationEnd', event);
      events$.next(new ChildActivationEnd(_objectSpread2({}, event)));
    } else if (event instanceof ChildActivationEnd) {
      // console.log('ChildActivationEnd', event);
      events$.next(new RouteConfigLoadStart(_objectSpread2({}, event)));
    } else if (event instanceof RouteConfigLoadStart) {
      // console.log('RouteConfigLoadStart', event);
      events$.next(new RouteConfigLoadEnd(_objectSpread2({}, event)));
    } else if (event instanceof RouteConfigLoadEnd) {
      // console.log('RouteConfigLoadEnd', event);
      events$.next(new NavigationEnd(_objectSpread2({}, event)));
    } else if (event instanceof NavigationEnd) {
      var segments = [];
      var source = event.route;

      while (source != null) {
        var _source$extractedUrl;

        // console.log(source.params, source.data);
        if ((_source$extractedUrl = source.extractedUrl) == null ? void 0 : _source$extractedUrl.length) {
          segments.push(source.extractedUrl);
        }

        if (source.childRoute) {
          source = source.childRoute;
        } else {
          var _source$remainUrl;

          if ((_source$remainUrl = source.remainUrl) == null ? void 0 : _source$remainUrl.length) {
            segments[segments.length - 1] = segments[segments.length - 1] + source.remainUrl;
          }

          source = undefined;
        }
      }

      var extractedUrl = segments.join('/').replace(/\/\//g, '/');
      console.log('NavigationEnd', event);
      clearRoutes_(routes, event.route);
      locationStrategy.setHistory(extractedUrl, undefined, event.trigger === 'popstate'); // setHistory_(locationStrategy, extractedUrl, undefined, event.trigger === 'popstate');

      route$.next(event.route);
    } else if (event instanceof NavigationCancel) {
      console.log('NavigationCancel', event);

      if (event.redirectTo) {
        events$.next(new NavigationStart({
          routerLink: event.redirectTo,
          trigger: 'imperative'
        }));
      }
    } else if (event instanceof NavigationError) {
      console.log('NavigationError', event);
    }
  }), operators.catchError(function (error) {
    return rxjs.of(new NavigationError(_objectSpread2(_objectSpread2({}, event), {}, {
      error: error
    })));
  }), operators.shareReplay(1));
}var RouterLinkDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(RouterLinkDirective, _Directive);

  function RouterLinkDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = RouterLinkDirective.prototype;

  _proto.getSegments = function getSegments(routerLink) {
    // console.log('RouterLinkDirective.getSegments', routerLink);
    var segments = [];
    routerLink.forEach(function (item) {
      if (typeof item === 'string') {
        var regExp = /([^:]+)|\:([^\/]+)/g;
        var matches = item.matchAll(regExp);
        var components = [];

        for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
          var match = _step.value;
          var g1 = match[1];
          var g2 = match[2];

          if (g1) {
            components.push(g1);
          } else if (g2) {
            var param = {};
            param[g2] = null;
            components.push(param);
          }
        }
      } else {
        segments.push(new RouteSegment('', {}));
      }
    });
    return segments;
  };

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var event$ = rxjs.fromEvent(node, 'click').pipe(operators.shareReplay(1));
    event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      // console.log('RouterLinkDirective', event, this.routerLink);
      // !!! skipLocationChange
      var navigationExtras = {
        skipLocationChange: _this.skipLocationChange,
        replaceUrl: _this.replaceUrl,
        state: _this.state
      };
      RouterService.setRouterLink(_this.routerLink, navigationExtras);
      event.preventDefault();
      return false;
    });
  };

  _proto.onChanges = function onChanges() {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var routePath = RouterService.getPath(this.routerLink_); // console.log('RouterLinkDirective.routePath', routePath);

    node.setAttribute('href', routePath.url);
  };

  _createClass(RouterLinkDirective, [{
    key: "routerLink",
    get: function get() {
      return this.routerLink_;
    },
    set: function set(routerLink) {
      this.routerLink_ = Array.isArray(routerLink) ? routerLink : [routerLink];
      this.segments = this.getSegments(this.routerLink_);
    }
  }]);

  return RouterLinkDirective;
}(rxcomp.Directive);
RouterLinkDirective.meta = {
  selector: '[routerLink],[[routerLink]]',
  inputs: ['routerLink']
};
/*
get urlTree(): UrlTree {
    return RouterService.createUrlTree(this.routerLink, {
        relativeTo: this.route,
        queryParams: this.queryParams,
        fragment: this.fragment,
        preserveQueryParams: this.preserve,
        queryParamsHandling: this.queryParamsHandling,
        preserveFragment: this.preserveFragment,
    });
}
*/var RouterLinkActiveDirective = /*#__PURE__*/function (_Directive) {
  _inheritsLoose(RouterLinkActiveDirective, _Directive);

  function RouterLinkActiveDirective() {
    var _this;

    _this = _Directive.apply(this, arguments) || this;
    _this.keys = [];
    return _this;
  }

  var _proto = RouterLinkActiveDirective.prototype;

  _proto.onChanges = function onChanges() {
    // console.log('RouterLinkActive.onChanges');
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.remove.apply(node.classList, this.keys);
    var keys = [];
    var active = this.isActive();

    if (active) {
      var object = this.routerLinkActive;

      if (typeof object === 'object') {
        for (var key in object) {
          if (object[key]) {
            keys.push(key);
          }
        }
      } else if (typeof object === 'string') {
        keys = object.split(' ').filter(function (x) {
          return x.length;
        });
      }
    }

    node.classList.add.apply(node.classList, keys);
    this.keys = keys; // console.log('RouterLinkActive.onChanges', active, keys);
  };

  _proto.isActive = function isActive() {
    var _path$route;

    var path = RouterService.getPath(this.host.routerLink);
    var isActive = ((_path$route = path.route) == null ? void 0 : _path$route.snapshot) != null; // console.log('RouterLinkActive.isActive', isActive);

    return isActive;
  };

  return RouterLinkActiveDirective;
}(rxcomp.Directive);
RouterLinkActiveDirective.meta = {
  selector: '[routerLinkActive],[[routerLinkActive]]',
  hosts: {
    host: RouterLinkDirective
  },
  inputs: ['routerLinkActive']
};var RouterOutletStructure = /*#__PURE__*/function (_Structure) {
  _inheritsLoose(RouterOutletStructure, _Structure);

  function RouterOutletStructure() {
    var _this;

    _this = _Structure.apply(this, arguments) || this;
    _this.route$_ = new rxjs.ReplaySubject(1);
    return _this;
  }

  var _proto = RouterOutletStructure.prototype;

  _proto.onInit = function onInit() {
    var _this2 = this;

    this.route$().pipe(operators.switchMap(function (snapshot) {
      return _this2.factory$(snapshot);
    }), operators.takeUntil(this.unsubscribe$)).subscribe(function () {// console.log(`RouterOutletStructure ActivatedRoutes: ["${RouterService.flatRoutes.filter(x => x.snapshot).map(x => x.snapshot?.extractedUrl).join('", "')}"]`);
    });

    if (this.host) {
      var _this$host$route;

      this.route$_.next((_this$host$route = this.host.route) == null ? void 0 : _this$host$route.childRoute);
    }
  };

  _proto.onChanges = function onChanges() {
    if (this.host) {
      var _this$host$route2;

      this.route$_.next((_this$host$route2 = this.host.route) == null ? void 0 : _this$host$route2.childRoute);
    }
  };

  _proto.route$ = function route$() {
    var _this3 = this;

    var source = this.host ? this.route$_ : RouterService.route$;
    return source.pipe(operators.filter(function (snapshot) {
      _this3.route_ = snapshot; // !!!

      if (_this3.snapshot_ && snapshot && _this3.snapshot_.component === snapshot.component) {
        _this3.snapshot_.next(snapshot);

        return false;
      } else {
        _this3.snapshot_ = snapshot;
        return true;
      }
    }));
  };

  _proto.factory$ = function factory$(snapshot) {
    var _this4 = this;

    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    var factory = snapshot == null ? void 0 : snapshot.component;

    if (this.factory_ !== factory) {
      this.factory_ = factory;
      return this.onExit$_(this.element, this.instance).pipe(operators.tap(function () {
        if (_this4.element) {
          _this4.element.parentNode.removeChild(_this4.element);

          module.remove(_this4.element, _this4);
          _this4.element = undefined;
          _this4.instance = undefined;
        }
      }), operators.switchMap(function () {
        if (snapshot && factory && factory.meta.template) {
          var element = document.createElement('div');
          element.innerHTML = factory.meta.template;

          if (element.children.length === 1) {
            element = element.firstElementChild;
          }

          node.appendChild(element);
          var instance = module.makeInstance(element, factory, factory.meta.selector, _this4, undefined, {
            route: snapshot
          });
          module.compile(element, instance);
          _this4.instance = instance;
          _this4.element = element;
          snapshot.instance = instance;
          return _this4.onEnter$_(element, instance);
        } else {
          return rxjs.of(false);
        }
      }));
    } else {
      return rxjs.of(false);
    }
  };

  _proto.onEnter$_ = function onEnter$_(element, instance) {
    if (element && instance && instance instanceof View) {
      return asObservable_([element], instance.onEnter);
    } else {
      return rxjs.of(true);
    }
  };

  _proto.onExit$_ = function onExit$_(element, instance) {
    if (element && instance && instance instanceof View) {
      return asObservable_([element], instance.onExit);
    } else {
      return rxjs.of(true);
    }
  };

  _createClass(RouterOutletStructure, [{
    key: "route",
    get: function get() {
      return this.route_;
    }
  }]);

  return RouterOutletStructure;
}(rxcomp.Structure);
RouterOutletStructure.meta = {
  selector: 'router-outlet,[router-outlet]',
  hosts: {
    host: RouterOutletStructure
  }
};

function asObservable_(args, callback) {
  return rxjs.Observable.create(function (observer) {
    var subscription;

    try {
      var result = callback.apply(void 0, args);

      if (rxjs.isObservable(result)) {
        subscription = result.subscribe(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (isPromise(result)) {
        result.then(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (typeof result === 'function') {
        observer.next(result());
        observer.complete();
      } else {
        observer.next(result);
        observer.complete();
      }
    } catch (error) {
      observer.error(error);
    }

    return function () {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
}
/*
set route(route: RouteSnapshot | undefined) {
    if (this.route_ && route && this.route_.component === route.component) {
        this.route_.next(route);
    } else {
        this.route_ = route;
        if (route) {
            this.factory = route.component;
            route.instance = this.instance;
        } else {
            this.factory = undefined;
        }
    }
}
get factory(): typeof Component | undefined {
    return this.factory_;
}
set factory(factory: typeof Component | undefined) {
    const { module, node } = getContext(this);
    if (this.factory_ !== factory) {
        this.factory_ = factory;
        if (this.element) {
            if (this.instance && this.instance instanceof View) {
                asObservable_([this.element], this.instance.onExit);
            }
            this.element.parentNode!.removeChild(this.element);
            module.remove(this.element, this);
            this.element = undefined;
            this.instance = undefined;
        }
        if (factory && factory.meta.template) {
            let element: IElement = document.createElement('div');
            element.innerHTML = factory.meta.template;
            if (element.children.length === 1) {
                element = element.firstElementChild as IElement;
            }
            node.appendChild(element);
            const instance: Factory | undefined = module.makeInstance(element, factory, factory.meta.selector!, this);
            module.compile(element, instance);
            this.instance = instance;
            this.element = element;
        }
    }
}
*/var factories = [RouterOutletStructure, RouterLinkDirective, RouterLinkActiveDirective];
var pipes = [];
/**
 *  RouterModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *   RouterModule.forRoot([
 *    { path: '', redirectTo: '/index', pathMatch: 'full' },
 *    { path: 'index', component: IndexComponent, data: { title: 'Index' } }
 *   ])
 *  ],
 *  declarations: [
 *   IndexComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */

var RouterModule = /*#__PURE__*/function (_Module) {
  _inheritsLoose(RouterModule, _Module);

  function RouterModule() {
    var _this;

    _this = _Module.call(this) || this; // console.log('RouterModule');

    RouterService.observe$.pipe(operators.tap(function (event) {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        var _this$instances;

        if ((_this$instances = _this.instances) == null ? void 0 : _this$instances.length) {
          var root = _this.instances[0];
          root.pushChanges();
        }
      }
    }), operators.takeUntil(_this.unsubscribe$)).subscribe();
    RouterService.navigate("" + window.location.pathname + window.location.search + window.location.hash);
    return _this;
  }

  RouterModule.forRoot = function forRoot(routes) {
    RouterService.setRoutes(routes);
    return this;
  };

  RouterModule.useStrategy = function useStrategy(locationStrategyType) {
    RouterService.useLocationStrategy(locationStrategyType);
    return this;
  };

  return RouterModule;
}(rxcomp.Module);
RouterModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};(function (RouteLocationStrategy) {
  RouteLocationStrategy["Path"] = "path";
  RouteLocationStrategy["Hash"] = "hash";
})(exports.RouteLocationStrategy || (exports.RouteLocationStrategy = {}));function transition$(callback) {
  return rxjs.Observable.create(function (observer) {
    // let subscription: Subscription;
    try {
      if (rxcomp.isPlatformBrowser) {
        callback(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    } catch (error) {
      observer.error(error);
    }
    /*
    return () => {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
    */

  });
}exports.ActivationEnd=ActivationEnd;exports.ActivationStart=ActivationStart;exports.ChildActivationEnd=ChildActivationEnd;exports.ChildActivationStart=ChildActivationStart;exports.GuardsCheckEnd=GuardsCheckEnd;exports.GuardsCheckStart=GuardsCheckStart;exports.LocationStrategy=LocationStrategy;exports.LocationStrategyHash=LocationStrategyHash;exports.LocationStrategyPath=LocationStrategyPath;exports.NavigationCancel=NavigationCancel;exports.NavigationEnd=NavigationEnd;exports.NavigationError=NavigationError;exports.NavigationStart=NavigationStart;exports.ResolveEnd=ResolveEnd;exports.ResolveStart=ResolveStart;exports.Route=Route;exports.RouteConfigLoadEnd=RouteConfigLoadEnd;exports.RouteConfigLoadStart=RouteConfigLoadStart;exports.RoutePath=RoutePath;exports.RouteSegment=RouteSegment;exports.RouteSnapshot=RouteSnapshot;exports.RouterEvent=RouterEvent;exports.RouterLinkActiveDirective=RouterLinkActiveDirective;exports.RouterLinkDirective=RouterLinkDirective;exports.RouterModule=RouterModule;exports.RouterOutletStructure=RouterOutletStructure;exports.RoutesRecognized=RoutesRecognized;exports.View=View;exports.transition$=transition$;Object.defineProperty(exports,'__esModule',{value:true});})));