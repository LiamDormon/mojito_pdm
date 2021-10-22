import { ClientUtils } from '@project-error/pe-utils';

class Utils extends ClientUtils {
  private Wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  SendUIMessage = <T>(action: string, data: T) => {
    SendNUIMessage({
      action: action,
      data: data,
    });
  };

  FomatTime = (time: number) => {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    if (seconds < 10) {
      return minutes + ':' + '0' + seconds;
    }
    return minutes + ':' + seconds;
  };

  TakePlateInput = async () => {
    AddTextEntry('FMMC_KEY_TIP1', 'Enter your reg number:');
    DisplayOnscreenKeyboard(1, 'FMMC_KEY_TIP1', '', '', '', '', '', 8);

    while (UpdateOnscreenKeyboard() != 1 && UpdateOnscreenKeyboard() != 2) {
      await this.Wait(10);
    }

    if (UpdateOnscreenKeyboard() != 2) {
      const result = GetOnscreenKeyboardResult();
      await this.Wait(500);
      return result;
    }

    return '';
  };

  Open = async (open: boolean) => {
    const Ped: number = PlayerPedId();
    if (open) {
      RequestAnimDict('amb@code_human_in_bus_passenger_idles@female@tablet@base');
      while (!HasAnimDictLoaded('amb@code_human_in_bus_passenger_idles@female@tablet@base')) {
        await this.Wait(10);
      }
      const TabletModel = GetHashKey('prop_cs_tablet');
      if (!DoesEntityExist(Player(-1).state['PDMTabletModel'])) {
        Player(-1).state['PDMTabletModel'] = CreateObject(
            TabletModel,
            1.0,
            1.0,
            1.0,
            true,
            true,
            false,
        );
      }
      const bone = GetPedBoneIndex(Ped, 60309);

      AttachEntityToEntity(
        Player(-1).state['PDMTabletModel'],
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
      }, 500);
    } else {
      const TabletProp = Player(-1).state['PDMTabletModel'];

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
        SetNuiFocus(false, false);
      }, 500);
    }
  };
}

export const utils = new Utils();
