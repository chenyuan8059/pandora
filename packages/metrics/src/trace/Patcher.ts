import {IPatcher} from '../domain';
const hookModule = require('module-hook');
const shimmer = require('shimmer');
import {TraceManager} from './TraceManager';
import {MessageSender} from '../util/MessageSender';
const assert = require('assert');
import {EnvironmentUtil, Environment} from 'pandora-env';

export class Patcher implements IPatcher {

  hookStore = {};
  options;
  env: Environment = EnvironmentUtil.getInstance().getCurrentEnvironment();
  appName = this.getAppName();

  constructor(options = {}) {
    this.options = options;
  }

  hook(version: string, reply: (loadModule, replaceSource?) => void) {
    this.hookStore[version] = reply;
  }

  getShimmer() {
    return shimmer;
  }

  run() {
    for(let version in this.hookStore) {
      this.getHook()(this.getModuleName(), version, this.hookStore[version]);
    }
  }

  getHook() {
    return hookModule;
  }

  getModuleName() {
    assert('please overwrite getModuleName() method before hook module!');
  }

  getTraceManager() {
    return TraceManager.getInstance();
  }

  getSender() {
    return new MessageSender();
  }

  getAppName() {
    return this.env.get('appName');
  }

}
