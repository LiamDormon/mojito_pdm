class Utils {
  private Wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  SendUIMessage = <T>(action: string, data: T) => {
    SendNUIMessage({
      action: action,
      data: data,
    });
  };

  Open = async (open: boolean): Promise<void> => {
    const Ped: number = PlayerPedId();
    if (open) {
      RequestAnimDict('amb@code_human_in_bus_passenger_idles@female@tablet@base');
      while (!HasAnimDictLoaded('amb@code_human_in_bus_passenger_idles@female@tablet@base')) {
        await this.Wait(10);
      }
      const ServerId = GetPlayerServerId(PlayerId());
      const TabletModel = GetHashKey('prop_cs_tablet');
      Player(ServerId).state['PDMTabletModel'] = CreateObject(
        TabletModel,
        1.0,
        1.0,
        1.0,
        true,
        true,
        false,
      );
      const bone = GetPedBoneIndex(Ped, 60309);

      AttachEntityToEntity(
        Player(ServerId).state['PDMTabletModel'],
        Ped,
        bone,
        0.03,
        0.02,
        -0.0,
        10.0,
        160.0,
        0.0,
        true,
        false,
        false,
        false,
        2,
        false,
      );
      TaskPlayAnim(
        Ped,
        'amb@code_human_in_bus_passenger_idles@female@tablet@base',
        'base',
        3.0,
        3.0,
        -1,
        49,
        0,
        false,
        false,
        false,
      );

      setTimeout(() => {
        SetNuiFocus(true, true);
        this.SendUIMessage<boolean>('setVisible', true);
      }, 1000);
    } else {
      const ServerId = GetPlayerServerId(PlayerId());
      const TabletProp = Player(ServerId).state['PDMTabletModel'];

      this.SendUIMessage<boolean>('setVisible', false);

      setTimeout(() => {
        DetachEntity(TabletProp, true, true);
        DeleteObject(TabletProp);
        TaskPlayAnim(
          Ped,
          'amb@code_human_in_bus_passenger_idles@female@tablet@base',
          'exit',
          3.0,
          3.0,
          -1,
          49,
          0,
          false,
          false,
          false,
        );
        SetNuiFocus(false, false)
      }, 1000);
    }
  };
}

export const PDM = new Utils();
