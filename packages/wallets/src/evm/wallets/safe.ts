import { ConnectParams, TWConnector } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";
import { SafeConnectionArgs } from "../connectors/safe/types";
import type { SafeConnector as SafeConnectorType } from "../connectors/safe";

export { SafeSupportedChainsSet } from "../connectors/safe";

// re-export the connection args for convenience
export type { SafeConnectionArgs } from "../connectors/safe/types";

export type SafeWalletOptions = WalletOptions<{}>;
export class SafeWallet extends AbstractBrowserWallet<{}, SafeConnectionArgs> {
  connector?: SafeConnectorType;

  static meta = {
    name: "Safe",
    iconURL:
      "ipfs://QmbbyxDDmmLQh8DzzeUR6X6B75bESsNUFmbdvS3ZsQ2pN1/SafeToken.svg",
  };

  static id = "Safe" as const;
  public get walletName() {
    return "Safe Wallet" as const;
  }

  constructor(options: SafeWalletOptions) {
    super(SafeWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      const { SafeConnector } = await import("../connectors/safe");
      this.connector = new SafeConnector();
    }
    return this.connector;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateChains(chains: Chain[]) {
    // no op
  }

  async connect(
    connectOptions: ConnectParams<SafeConnectionArgs>,
  ): Promise<string> {
    // can't save params to storage because one of them is a class instance and can't be saved
    return await super.connect({ ...connectOptions, saveParams: false });
  }

  getPersonalWallet() {
    return this.connector?.personalWallet;
  }
}